"use client";

import * as React from "react";
import { ChartPieIcon } from "lucide-react";
import { Label, Pie, PieChart, Sector } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { type PieSectorDataItem } from "recharts/types/polar/Pie";

const chartConfig = {
  "VE-V0": {
    label: "VE-V0",
    color: "#84cc16",
  },
  "V1-V2": {
    label: "V1-V2",
    color: "#3b82f6",
  },
  "V3-V4": {
    label: "V3-V4",
    color: "#facc15",
  },
  "V5-V6": {
    label: "V5-V6",
    color: "#ef4444",
  },
  "V7-V8": {
    label: "V7-V9",
    color: "#8b5cf6",
  },
  "V9+": {
    label: "V9+",
    color: "#ec4899",
  },
} satisfies ChartConfig;

type BouldersBreakdownChartProps = {
  totalUniqueBoulders: number;
  gradeRangeCounts: Record<string, number>;
};

export function BouldersBreakdownChart({
  totalUniqueBoulders,
  gradeRangeCounts,
}: BouldersBreakdownChartProps) {
  const chartData = Object.entries(gradeRangeCounts)
    .map(([grade, count]) => ({
      grade,
      count,
      fill: `var(--color-${grade})`,
    }))
    .sort((a, b) => (a.grade < b.grade ? 1 : -1));

  const highestGradeRange = Object.keys(gradeRangeCounts).reduce((a, b) =>
    (gradeRangeCounts[a] ?? 0) > (gradeRangeCounts[b] ?? 0) ? a : b,
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Grade Breakdown</CardTitle>
        <ChartPieIcon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="grade"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={chartData.findIndex(
                ({ grade }) => grade === highestGradeRange,
              )}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 8} />
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {totalUniqueBoulders}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Unique Boulders
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center text-nowrap text-center font-medium leading-none">
          Your most ascended grade range is
          <span className="ml-1 text-nowrap font-bold">
            {highestGradeRange}
          </span>
          .
        </div>
      </CardFooter>
    </Card>
  );
}
