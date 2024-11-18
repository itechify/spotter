import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { desc, eq, sql } from "drizzle-orm";
import { boulders, ticks } from "./db/schema";

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

export async function getMyHighestSentBoulderTick() {
  const user = auth();
  const userId = (await user).userId;

  if (!userId) throw new Error("Unauthorized");

  // Join ticks and boulders tables and order by the boulder grade
  const highestSentBoulderTick = await db
    .select()
    .from(ticks)
    .innerJoin(boulders, eq(ticks.boulderId, boulders.id))
    .where(eq(ticks.userId, userId))
    .orderBy(desc(boulders.grade)) // Order by boulder grade
    .limit(1); // Get the highest-rated tick

  if (!highestSentBoulderTick[0]) return null;

  return {
    ...highestSentBoulderTick[0].tick,
    boulder: highestSentBoulderTick[0].boulder,
  };
}

export async function getMyTicks() {
  const user = auth();
  const userId = (await user).userId;

  if (!userId) throw new Error("Unauthorized");

  const ticks = await db.query.ticks.findMany({
    with: {
      boulder: true,
    },
    where: (tick, { eq }) => eq(tick.userId, userId),
    orderBy: (tick, { desc }) => desc(tick.date),
  });

  return ticks;
}

export async function getMyMonthlyTickStats() {
  const user = auth();
  const userId = (await user).userId;

  if (!userId) throw new Error("Unauthorized");

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
