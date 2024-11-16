import { getBouldersWithMyTicks } from "~/server/queries";
import { BoulderCard } from "./_components/boulder-card";

export const dynamic = "force-dynamic";

export default async function BouldersPage() {
  const boulders = await getBouldersWithMyTicks();

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-center gap-4 px-4">
        {boulders.map((boulder) => {
          const tick = boulder.ticks.length > 0 ? boulder.ticks[0] : undefined;

          const sendStatus = tick ? (tick.flash ? "flash" : "sent") : "unsent";

          return (
            <BoulderCard
              key={boulder.id}
              sendStatus={sendStatus}
              isClassic={Number(tick?.rating) > 3}
              {...boulder}
            />
          );
        })}
      </div>
    </div>
  );
}
