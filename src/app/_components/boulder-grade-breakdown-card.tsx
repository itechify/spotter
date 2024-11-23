import { getMyBoulderGradeBreakdown } from "~/server/queries";
import { GradeBreakdownChart } from "./grade-breakdown-chart";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ChartPieIcon } from "lucide-react";
import { cn } from "~/lib/utils";

// TODO: utils file?
const getGradeRangeColor = (gradeRange: string) => {
  switch (gradeRange) {
    case "VE-V0":
      return "text-beginner";
    case "V1-V2":
      return "text-intermediate-1";
    case "V3-V4":
      return "text-intermediate-2";
    case "V5-V6":
      return "text-advanced-1";
    case "V7-V8":
      return "text-advanced-2";
    case "V9+":
      return "text-elite";
    default:
      return "text-beginner";
  }
};

export async function BoulderGradeBreakdownCard() {
  const boulderGradeBreakdown = await getMyBoulderGradeBreakdown();

  const highestGradeRange = Object.keys(
    boulderGradeBreakdown.gradeRangeCounts,
  ).reduce((a, b) =>
    (boulderGradeBreakdown.gradeRangeCounts[a] ?? 0) >
    (boulderGradeBreakdown.gradeRangeCounts[b] ?? 0)
      ? a
      : b,
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Grade Breakdown</CardTitle>
        <ChartPieIcon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <GradeBreakdownChart {...boulderGradeBreakdown} />{" "}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center text-nowrap text-center font-medium leading-none">
          Your most ascended grade range is
          <span
            className={cn(
              "ml-1 text-nowrap font-bold",
              getGradeRangeColor(highestGradeRange),
            )}
          >
            {highestGradeRange}
          </span>
          .
        </div>
      </CardFooter>
    </Card>
  );
}
