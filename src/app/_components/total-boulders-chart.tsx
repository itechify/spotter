"use client";

import { ChartPieIcon, ListChecksIcon, TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

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

//TODO: this is same as in monthly-ticks-chart
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

type TotalBouldersChartProps = {
  sendCount: number;
  flashCount: number;
};

export function TotalBouldersChart({
  sendCount,
  flashCount,
}: TotalBouldersChartProps) {
  const totalTicks = sendCount + flashCount;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Totals</CardTitle>
        <ListChecksIcon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex h-full items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={[{ sendCount, flashCount }]}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
            cy="65%"
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) - 16}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {totalTicks}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Ticks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="sendCount"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-sendCount)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="flashCount"
              fill="var(--color-flashCount)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
