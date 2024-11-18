"use client";

import { Square, SquareCheckIcon } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { Toggle } from "~/components/ui/toggle";

const chartConfig = {
  sendCount: {
    label: "Sends",
    color: "#65a30d",
  },
  flashCount: {
    label: "Flashes",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

export type MonthlyTicksStats = {
  yearMonth: string;
  sendCount: number;
  flashCount: number;
}[];

type MonthlyTicksChartProps = {
  data: MonthlyTicksStats;
};

export function MonthlyTicksChart({ data }: MonthlyTicksChartProps) {
  const [includeAllYears, setIncludeAllYears] = useState(false);

  if (!includeAllYears) {
    data = data.filter((tick) =>
      tick.yearMonth.includes(String(new Date().getFullYear()).substring(2)),
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Boulders</CardTitle>
        <CardDescription>
          Your monthly send and flash count{" "}
          {includeAllYears ? "through the years" : "for this year"}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full justify-end">
          <Toggle
            aria-label="Toggle all years ticks"
            onPressedChange={setIncludeAllYears}
          >
            {includeAllYears ? <SquareCheckIcon /> : <Square />}
            All Years
          </Toggle>
        </div>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="yearMonth"
              tickLine={false}
              axisLine={false}
              interval={"equidistantPreserveStart"}
              tickFormatter={(value) => value.split(" ")[0]}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="sendCount"
              stackId="a"
              fill="var(--color-sendCount)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="flashCount"
              stackId="a"
              fill="var(--color-flashCount)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}