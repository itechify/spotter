import { AwardIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TickCard } from "../boulders/my-ticks/_components/tick-card";
import { getHardestBoulderTick } from "~/server/queries";

type HardestBoulderSendCardProps = {
  userId: string;
};

/**
 * A card that shows the hardest sent boulder tick for a user.
 */
export async function HardestBoulderSendCard({
  userId,
}: HardestBoulderSendCardProps) {
  const tick = await getHardestBoulderTick(userId);

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
