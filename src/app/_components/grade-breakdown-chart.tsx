"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";

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
    color: "hsl(var(--beginner))",
  },
  "V1-V2": {
    label: "V1-V2",
    color: "hsl(var(--intermediate-1))",
  },
  "V3-V4": {
    label: "V3-V4",
    color: "hsl(var(--intermediate-2))",
  },
  "V5-V6": {
    label: "V5-V6",
    color: "hsl(var(--advanced-1))",
  },
  "V7-V8": {
    label: "V7-V9",
    color: "hsl(var(--advanced-2))",
  },
  "V9+": {
    label: "V9+",
    color: "hsl(var(--elite))",
  },
} satisfies ChartConfig;

type GradeBreakdownChartProps = {
  totalUniqueBoulders: number;
  gradeRangeCounts: Record<string, number>;
};

export function GradeBreakdownChart({
  totalUniqueBoulders,
  gradeRangeCounts,
}: GradeBreakdownChartProps) {
  const chartData = Object.entries(gradeRangeCounts)
    .map(([gradeRange, count]) => ({
      gradeRange,
      count,
      fill: `var(--color-${gradeRange})`,
    }))
    .sort((a, b) => (a.gradeRange < b.gradeRange ? 1 : -1));

  const highestGradeRange = Object.keys(gradeRangeCounts).reduce((a, b) =>
    (gradeRangeCounts[a] ?? 0) > (gradeRangeCounts[b] ?? 0) ? a : b,
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[300px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="gradeRange"
          innerRadius={60}
          strokeWidth={5}
          activeIndex={chartData.findIndex(
            ({ gradeRange }) => gradeRange === highestGradeRange,
          )}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
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
  );
}
