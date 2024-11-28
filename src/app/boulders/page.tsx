import { getBouldersWithMyTicks, getMyTodos } from "~/server/queries";
import { BoulderCard } from "./_components/boulder-card";

export const dynamic = "force-dynamic";

export default async function BouldersPage() {
  const boulders = await getBouldersWithMyTicks();
  // TODO: get this with the boulders query instead?
  const myTodos = await getMyTodos();

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
              isTodo={myTodos.some((todo) => todo.boulderId === boulder.id)}
              {...boulder}
            />
          );
        })}
      </div>
    </div>
  );
}
