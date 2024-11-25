import { getMyTicks } from "~/server/queries";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollTextIcon } from "lucide-react";
import { TickCard } from "../boulders/my-ticks/_components/tick-card";

export async function LatestTicksCard() {
  const ticks = await getMyTicks();

  // TODO: The following is the same as in MyBoulderTicksPage
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

  const ticksWithRepeatFlag = ticks.slice(0, 10).map((tick) => ({
    ...tick,
    repeat:
      new Date(tick.date) > new Date(boulderFirstTicks.get(tick.boulder.id)!),
  }));

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Latest Ticks</CardTitle>
        <ScrollTextIcon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent className="grid h-full auto-rows-min grid-cols-1 place-content-center items-center gap-4 2xl:grid-cols-2">
        {ticksWithRepeatFlag.map((tick, index) => (
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
            className={`w-full ${index >= 5 && "hidden 2xl:block"}`}
          />
        ))}
      </CardContent>
    </Card>
  );
}
