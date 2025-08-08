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
import { getBoulderGradeBreakdown } from "~/server/queries";

// TODO: utils file?
const getGradeRangeColor = (gradeRange: string) => {
  switch (gradeRange) {
    case "VE-V0":
      return "text-beginner";
    case "V1-V2":
      return "text-novice";
    case "V3-V5":
      return "text-intermediate";
    case "V6-V8":
      return "text-advanced";
    case "V9-V12":
      return "text-expert";
    case "V13+":
      return "text-elite";
    default:
      return "text-beginner";
  }
};

type BoulderGradeBreakdownCardProps = {
  userId: string;
};

export async function BoulderGradeBreakdownCard({
  userId,
}: BoulderGradeBreakdownCardProps) {
  const boulderGradeBreakdown = await getBoulderGradeBreakdown(userId);

  if (boulderGradeBreakdown.totalUniqueBoulders === 0) {
    return null;
  }

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
