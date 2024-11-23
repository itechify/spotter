import { AwardIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TickCard } from "../boulders/my-ticks/_components/tick-card";
import { getMyHardestSentBoulderTick } from "~/server/queries";

// TODO: utils file?
const getGradeBorderColor = (grade: string) => {
  switch (grade) {
    case "V-easy":
    case "V0":
      return "border-beginner";
    case "V1":
    case "V2":
      return "border-intermediate-1";
    case "V3":
    case "V4":
      return "border-intermediate-2";
    case "V5":
    case "V6":
      return "border-advanced-1";
    case "V7":
    case "V8":
      return "border-advanced-2";
    case "V9":
    case "V10":
    case "V11":
    case "V12":
    case "V13":
    case "V14":
    case "V15":
    case "V16":
    case "V17":
      return "border-elite";
    default:
      return "border-beginner";
  }
};

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
            className={getGradeBorderColor(tick.boulder.grade)}
          />
        )}
      </CardContent>
    </Card>
  );
}
