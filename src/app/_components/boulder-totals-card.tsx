import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ListChecksIcon } from "lucide-react";
import { TotalTicksChart } from "./total-ticks-chart";
import { getTicks } from "~/server/queries";

type BoulderTotalsCardProps = {
  userId: string;
};

/**
 * A card that shows the total number of ticks for a user.
 */
export async function BoulderTotalsCard({ userId }: BoulderTotalsCardProps) {
  const ticks = await getTicks(userId);
  const flashCount = ticks.filter((tick) => tick.flash).length;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Totals</CardTitle>
        <ListChecksIcon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex h-full items-center justify-center">
        <TotalTicksChart
          flashCount={flashCount}
          sendCount={ticks.length - flashCount}
        />
      </CardContent>
    </Card>
  );
}
