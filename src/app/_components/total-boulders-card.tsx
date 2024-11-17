import { MountainIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getMyTicks } from "~/server/queries";

export default async function TotalBouldersCard() {
  const ticks = await getMyTicks();

  const flashCount = ticks.filter((tick) => tick.flash).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Boulder</CardTitle>
        <MountainIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{ticks.length} ticks</div>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">{flashCount}</span> were{" "}
          <span className="text-amber-500 dark:text-amber-300">flashes</span>
        </p>
      </CardContent>
    </Card>
  );
}
