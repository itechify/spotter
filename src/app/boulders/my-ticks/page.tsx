import { getMyTicks } from "~/server/queries";
import { TickCard } from "./_components/tick-card";

export const dynamic = "force-dynamic";

export default async function MyBoulderTicksPage() {
  const ticks = await getMyTicks();

  // Preprocess to determine if a tick is a repeat
  const boulderFirstTicks = new Map<number, string>();

  ticks.forEach((tick) => {
    if (!boulderFirstTicks.has(tick.boulder.id)) {
      boulderFirstTicks.set(tick.boulder.id, tick.date);
    } else if (
      new Date(tick.date) < new Date(boulderFirstTicks.get(tick.boulder.id)!)
    ) {
      boulderFirstTicks.set(tick.boulder.id, tick.date);
    }
  });

  const ticksWithRepeatFlag = ticks.map((tick) => ({
    ...tick,
    repeat:
      new Date(tick.date) > new Date(boulderFirstTicks.get(tick.boulder.id)!),
  }));

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-center gap-4 px-4">
        {ticksWithRepeatFlag.map((tick) => {
          return (
            <TickCard
              key={tick.id}
              boulderName={tick.boulder.name}
              boulderGrade={tick.boulder.grade}
              boulderUrl={tick.boulder.url}
              rating={tick.rating}
              date={tick.date}
              flash={tick.flash}
              repeat={tick.repeat}
              betaUrl={tick.betaUrl}
            />
          );
        })}
      </div>
    </div>
  );
}
