import { getBouldersWithMyTicks, getMyTodos } from "~/server/queries";
import { BoulderCard } from "./_components/boulder-card";
import { OnlyTodosToggle } from "./_components/only-todos-toggle";

export const dynamic = "force-dynamic";

export default async function BouldersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  let boulders = await getBouldersWithMyTicks();
  // TODO: get this with the boulders query instead?
  const myTodos = await getMyTodos();
  const { onlyTodos } = await searchParams;

  // Filter out boulders that are not in my todos if onlyTodos is in the search params
  if (onlyTodos !== undefined) {
    boulders = boulders.filter((boulder) =>
      myTodos.some((todo) => todo.boulderId === boulder.id),
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-center">
        <OnlyTodosToggle />
      </div>
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
