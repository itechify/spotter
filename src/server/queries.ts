import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { boulders, ticks, todos } from "./db/schema";
import { revalidatePath } from "next/cache";
import analyticsServerClient from "./analytics";

export type BoulderWithMyTicks = (typeof boulders)["$inferSelect"] & {
  ticks: (typeof ticks)["$inferSelect"][];
};

export async function getBouldersWithMyTicks() {
  const user = auth();
  const userId = (await user).userId;

  const boulders = await db.query.boulders.findMany({
    with: {
      ticks: {
        where: (tick, { eq }) => eq(tick.userId, userId ?? ""),
        orderBy: (tick, { asc }) => asc(tick.date),
      },
    },
    orderBy: (boulder, { desc }) => desc(boulder.grade),
  });
  return boulders;
}

export async function getBoulders() {
  const boulders = await db.query.boulders.findMany({
    orderBy: (boulder, { desc }) => desc(boulder.grade),
  });
  return boulders;
}

export async function getBouldersWithMyTicksPaginated(params: {
  page?: number;
  perPage?: number;
  onlyTodos?: boolean;
}): Promise<{ items: BoulderWithMyTicks[]; hasNextPage: boolean }> {
  const { page = 1, perPage = 48, onlyTodos = false } = params ?? {};
  const user = auth();
  const userId = (await user).userId;

  const offset = Math.max(0, (page - 1) * perPage);

  let itemsPlusOne: BoulderWithMyTicks[];

  if (onlyTodos && userId) {
    const userTodos = await db.query.todos.findMany({
      columns: { boulderId: true },
      where: (todo, { eq }) => eq(todo.userId, userId),
    });
    const todoBoulderIds = userTodos.map((t) => t.boulderId);

    if (todoBoulderIds.length === 0) {
      return { items: [], hasNextPage: false };
    }

    itemsPlusOne = (await db.query.boulders.findMany({
      with: {
        ticks: {
          where: (tick, { eq }) => eq(tick.userId, userId ?? ""),
          orderBy: (tick, { asc }) => asc(tick.date),
        },
      },
      where: (boulder, { inArray }) => inArray(boulder.id, todoBoulderIds),
      orderBy: (boulder, { desc }) => desc(boulder.grade),
      limit: perPage + 1,
      offset,
    })) as unknown as BoulderWithMyTicks[];
  } else {
    itemsPlusOne = (await db.query.boulders.findMany({
      with: {
        ticks: {
          where: (tick, { eq }) => eq(tick.userId, userId ?? ""),
          orderBy: (tick, { asc }) => asc(tick.date),
        },
      },
      orderBy: (boulder, { desc }) => desc(boulder.grade),
      limit: perPage + 1,
      offset,
    })) as unknown as BoulderWithMyTicks[];
  }

  const hasNextPage = itemsPlusOne.length > perPage;
  const items = hasNextPage ? itemsPlusOne.slice(0, perPage) : itemsPlusOne;

  return { items, hasNextPage };
}

export async function getHardestBoulderTick(userId: string) {
  // Join ticks and boulders tables and order by the boulder grade
  const hardestSentBoulderTick = await db
    .select()
    .from(ticks)
    .innerJoin(boulders, eq(ticks.boulderId, boulders.id))
    .where(eq(ticks.userId, userId))
    .orderBy(desc(boulders.grade)) // Order by boulder grade
    .limit(1); // Get the hardest-rated tick

  if (!hardestSentBoulderTick[0]) return null;

  return {
    ...hardestSentBoulderTick[0].tick,
    boulder: hardestSentBoulderTick[0].boulder,
  };
}

export async function getTicks(userId: string) {
  const ticks = await db.query.ticks.findMany({
    with: {
      boulder: true,
    },
    where: (tick, { eq }) => eq(tick.userId, userId),
    orderBy: (tick, { desc }) => desc(tick.date),
  });

  return ticks;
}

export async function getMonthlyTickStats(userId: string) {
  const tickStats = (
    await db
      .select({
        yearMonth:
          sql<string>`TO_CHAR(TO_DATE(${ticks.date}, 'YYYY-MM-DD'), 'MON YY')`.as(
            "year_month",
          ),
        tickCount: sql<number>`COUNT(*)::int`.as("tick_count"),
        flashCount:
          sql<number>`COUNT(CASE WHEN ${ticks.flash} THEN 1 END)::int`.as(
            "flash_count",
          ),
      })
      .from(ticks)
      .where(sql`${ticks.userId} = ${userId}`)
      .groupBy(
        sql`TO_CHAR(TO_DATE(${ticks.date}, 'YYYY-MM-DD'), 'MON YY')`,
        sql`EXTRACT(YEAR FROM TO_DATE(${ticks.date}, 'YYYY-MM-DD'))`,
        sql`EXTRACT(MONTH FROM TO_DATE(${ticks.date}, 'YYYY-MM-DD'))`,
      )
      .orderBy(
        sql`EXTRACT(YEAR FROM TO_DATE(${ticks.date}, 'YYYY-MM-DD'))`,
        sql`EXTRACT(MONTH FROM TO_DATE(${ticks.date}, 'YYYY-MM-DD'))`,
      )
  ).map((tick) => {
    return {
      yearMonth: tick.yearMonth,
      sendCount: tick.tickCount - tick.flashCount,
      flashCount: tick.flashCount,
    };
  });

  return fillMissingMonths(tickStats);
}

// TODO: This seems like a hacky way to fill in missing months. There's probably a better way to do this.
function fillMissingMonths(
  tickStats: { yearMonth: string; sendCount: number; flashCount: number }[],
) {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  // Helper to calculate the next month-year string
  function getNextMonthYear(currentYearMonth: string): string {
    const [currentMonth, year] = currentYearMonth.split(" ");
    const monthIndex = months.indexOf(currentMonth!);
    const currentYear = parseInt(year!, 10);

    const nextMonthIndex = (monthIndex + 1) % 12;
    const nextYear = nextMonthIndex === 0 ? currentYear + 1 : currentYear;

    return `${months[nextMonthIndex]} ${String(nextYear).padStart(2, "0")}`;
  }

  const filledStats = [];
  for (let i = 0; i < tickStats.length; i++) {
    const current = tickStats[i]!;
    filledStats.push(current);

    if (i < tickStats.length - 1) {
      let expectedNext = getNextMonthYear(current.yearMonth);
      while (expectedNext !== tickStats[i + 1]!.yearMonth) {
        filledStats.push({
          yearMonth: expectedNext,
          sendCount: 0,
          flashCount: 0,
        });
        expectedNext = getNextMonthYear(expectedNext);
      }
    }
  }

  return filledStats;
}

export async function getBoulderGradeBreakdown(userId: string) {
  const distinctTicks = await db
    .selectDistinctOn([ticks.boulderId])
    .from(ticks)
    .leftJoin(boulders, eq(ticks.boulderId, boulders.id))
    .where(eq(ticks.userId, userId));

  // Define grade ranges
  const gradeRanges: Record<string, string[]> = {
    "VE-V0": ["V-easy", "V0"],
    "V1-V2": ["V1", "V2"],
    "V3-V5": ["V3", "V4", "V5"],
    "V6-V8": ["V6", "V7", "V8"],
    "V9-V12": ["V9", "V10", "V11", "V12"],
    "V13+": ["V13", "V14", "V15", "V16", "V17"],
  };

  // Initialize counts for each range
  const rangeCounts: Record<string, number> = {
    "VE-V0": 0,
    "V1-V2": 0,
    "V3-V5": 0,
    "V6-V8": 0,
    "V9-V12": 0,
    "V13+": 0,
  };

  // Process grades into ranges
  distinctTicks.forEach(({ boulder }) => {
    if (!boulder) return;
    const grade = boulder.grade;

    // Determine which range the grade belongs to
    for (const [range, grades] of Object.entries(gradeRanges)) {
      if (grades.includes(grade)) {
        rangeCounts[range] = (rangeCounts[range] ?? 0) + 1;
        break;
      }
    }
  });

  const result = {
    totalUniqueBoulders: distinctTicks.length,
    gradeRangeCounts: rangeCounts, // Use rangeCounts instead of individual grades
  };

  return result;
}

export async function getMyTodos() {
  const user = auth();
  const userId = (await user).userId;

  if (!userId) throw new Error("Unauthorized");

  const todos = await db.query.todos.findMany({
    where: (todo, { eq }) => eq(todo.userId, userId),
  });

  return todos;
}

export async function addTodo(boulderId: number) {
  const user = auth();
  const userId = (await user).userId;

  if (!userId) throw new Error("Unauthorized");

  const newTodo = await db.insert(todos).values({
    boulderId,
    userId,
  });

  analyticsServerClient.capture({
    distinctId: userId,
    event: "user added todo",
    properties: {
      boulderId,
    },
  });

  revalidatePath("/boulders");

  return newTodo;
}

export async function removeTodo(boulderId: number) {
  const user = auth();
  const userId = (await user).userId;

  if (!userId) throw new Error("Unauthorized");

  await db
    .delete(todos)
    .where(and(eq(todos.boulderId, boulderId), eq(todos.userId, userId)));

  analyticsServerClient.capture({
    distinctId: userId,
    event: "user removed todo",
    properties: {
      boulderId,
    },
  });

  revalidatePath("/boulders");
}
