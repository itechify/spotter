import { getBouldersWithMyTicksPaginated, getMyTodos } from "~/server/queries";
import { BoulderCard } from "./_components/boulder-card";
import { OnlyTodosToggle } from "./_components/only-todos-toggle";

export const dynamic = "force-dynamic";

export default async function BouldersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? 1);
  const perPage = Number(sp.perPage ?? 48);
  const onlyTodos = sp.onlyTodos !== undefined;

  const { items: boulders, hasNextPage } =
    await getBouldersWithMyTicksPaginated({ page, perPage, onlyTodos });
  const myTodos = await getMyTodos();

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
      <div className="flex items-center justify-center gap-4 py-6">
        {page > 1 && (
          <a
            className="text-primary underline-offset-4 hover:underline"
            href={`/boulders?page=${page - 1}&perPage=${perPage}${onlyTodos ? "&onlyTodos=true" : ""}`}
          >
            Previous
          </a>
        )}
        {hasNextPage && (
          <a
            className="text-primary underline-offset-4 hover:underline"
            href={`/boulders?page=${page + 1}&perPage=${perPage}${onlyTodos ? "&onlyTodos=true" : ""}`}
          >
            Next
          </a>
        )}
      </div>
    </div>
  );
}
