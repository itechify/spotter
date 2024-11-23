"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { ticksChartConfig } from "./monthly-ticks-chart";

type TotalTicksChartProps = {
  sendCount: number;
  flashCount: number;
};

export function TotalTicksChart({
  sendCount,
  flashCount,
}: TotalTicksChartProps) {
  const totalTicks = sendCount + flashCount;

  return (
    <ChartContainer
      config={ticksChartConfig}
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
  );
}
