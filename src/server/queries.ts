import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";

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

export async function getMyTicks() {
  const user = auth();
  const userId = (await user).userId;

  if (!userId) throw new Error("Unauthorized");

  const ticks = await db.query.ticks.findMany({
    where: (tick, { eq }) => eq(tick.userId, userId),
    orderBy: (tick, { desc }) => desc(tick.date),
  });
  return ticks;
}
