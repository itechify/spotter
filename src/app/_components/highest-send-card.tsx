import { AwardIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getMyHighestSentBoulderTick } from "~/server/queries";
import { TickCard } from "../boulders/my-ticks/_components/tick-card";

export async function HighestSendCard() {
  const tick = await getMyHighestSentBoulderTick();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">Highest Send</CardTitle>
        <AwardIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex justify-center">
        {tick && (
          <TickCard
            boulderName={tick.boulder.name}
            rating={tick.rating ?? "0"}
            flash={tick.flash}
            boulderGrade={tick.boulder.grade}
            date={tick.date}
            boulderUrl={tick.boulder.url}
            repeat={false}
            betaUrl={tick.betaUrl}
          />
        )}
      </CardContent>
    </Card>
  );
}
