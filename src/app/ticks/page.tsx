import { getMyTicks } from "~/server/queries";
import { TickCard } from "./_components/tick-card";

export const dynamic = "force-dynamic";

export default async function TicksPage() {
  const ticks = await getMyTicks();

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-center gap-4 px-4">
        {ticks.map((tick) => {
          return (
            <TickCard
              key={tick.id}
              boulderName={tick.boulder.name}
              boulderGrade={tick.boulder.grade}
              boulderUrl={tick.boulder.url}
              rating={tick.rating ?? "0"}
              date={tick.date}
              flash={tick.flash}
            />
          );
        })}{" "}
      </div>
    </div>
  );
}
