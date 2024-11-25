import { AwardIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TickCard } from "../boulders/my-ticks/_components/tick-card";
import { getMyHardestSentBoulderTick } from "~/server/queries";

export async function HardestBoulderSendCard() {
  const tick = await getMyHardestSentBoulderTick();

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Hardest Send</CardTitle>
        <AwardIcon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex h-full items-center justify-center">
        {tick && (
          <TickCard
            boulderName={tick.boulder.name}
            rating={tick.rating}
            flash={tick.flash}
            boulderGrade={tick.boulder.grade}
            date={tick.date}
            boulderUrl={tick.boulder.url}
            repeat={false}
            betaUrl={tick.betaUrl}
            className="w-4/5"
          />
        )}
      </CardContent>
    </Card>
  );
}
