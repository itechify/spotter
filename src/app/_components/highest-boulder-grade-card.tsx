import { AwardIcon, CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getMyHighestSentBoulderTick } from "~/server/queries";

export default async function HighestBoulderGradeCard() {
  const tick = await getMyHighestSentBoulderTick();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Highest Grade Sent
        </CardTitle>
        <AwardIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex h-24 flex-col justify-center gap-2 text-center">
        <div className="text-center text-4xl font-bold text-orange-500">
          {tick ? tick.boulder.grade : "n/a"}
        </div>
        <div className="text-md flex justify-between">
          <p className="truncate font-semibold">
            {tick ? tick.boulder.name : ""}
          </p>
          <p className="text-muted-foreground">
            {tick ? (
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-5 w-5" />
                {new Date(tick?.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            ) : (
              ""
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
