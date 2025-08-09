"use client";

import { CalendarIcon, FilmIcon, Repeat, Star, Zap } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  getGradeBackgroundColorClass,
  getGradeBorderColorClass,
  getGradeHoverBackgroundClass,
  getGradeRingColorClass,
} from "~/lib/grade-style";

interface TickCardProps {
  boulderName: string;
  boulderGrade: string;
  boulderUrl: string;
  rating: string | null;
  date: string;
  flash: boolean;
  repeat: boolean;
  betaUrl: string | null;
  className?: string;
}

const ratingLabels = ["Ok", "Good", "Great", "Classic"];

//

export function TickCard({
  boulderName,
  boulderGrade,
  boulderUrl,
  rating,
  date,
  flash,
  repeat,
  betaUrl,
  className,
}: TickCardProps) {
  return (
    <Card
      className={cn(
        "group h-fit w-96 min-w-64 cursor-pointer border-2 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:ring-2 focus-visible:outline-none focus-visible:ring-2",
        getGradeBackgroundColorClass(boulderGrade),
        getGradeBorderColorClass(boulderGrade),
        getGradeHoverBackgroundClass(boulderGrade),
        getGradeRingColorClass(boulderGrade),
        className,
      )}
      role="link"
      tabIndex={0}
      onClick={(event) => {
        // Avoid triggering when an inner interactive element is clicked
        const target = event.target as HTMLElement;
        if (target.closest("a, button, [role='button']")) return;
        window.open(boulderUrl, "_blank", "noreferrer");
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          const target = event.target as HTMLElement;
          if (target.closest("a, button, [role='button']")) return;
          event.preventDefault();
          window.open(boulderUrl, "_blank", "noreferrer");
        }
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle title={boulderName} className="truncate text-xl font-bold">
            <span className="text-primary underline-offset-4 group-hover:underline">
              {boulderName}
            </span>
          </CardTitle>
          <TooltipProvider>
            <div className="flex gap-1">
              {repeat && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Repeat
                      className="h-6 w-6 fill-current text-lime-500"
                      aria-label="Repeat"
                    />
                  </TooltipTrigger>
                  <TooltipContent>Repeat</TooltipContent>
                </Tooltip>
              )}
              {flash && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Zap
                      className="h-6 w-6 fill-current text-yellow-500"
                      aria-label="Flash"
                    />
                  </TooltipTrigger>
                  <TooltipContent>Flash</TooltipContent>
                </Tooltip>
              )}
              <Badge
                variant="secondary"
                className="text-nowrap text-sm font-semibold"
              >
                {boulderGrade}
              </Badge>
            </div>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="flex justify-between gap-2">
        <div className="group/stars relative flex w-fit flex-col">
          <div className="flex w-fit gap-1 transition-transform duration-150 group-hover/stars:-translate-y-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <Star
                key={index}
                className={`h-5 w-5 ${
                  index + 1 <= Number(rating ?? 0)
                    ? "fill-current text-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="flex max-h-0 justify-center overflow-hidden text-sm font-medium text-muted-foreground opacity-0 transition-all duration-150 group-hover/stars:max-h-6 group-hover/stars:opacity-100">
            {ratingLabels[parseInt(rating ?? "0", 10) - 1] ?? "Unrated"}
          </div>
        </div>
        <div
          className={cn(
            "flex w-fit flex-col gap-1",
            betaUrl ? "justify-end" : "justify-center",
          )}
        >
          {betaUrl && (
            <a
              href={betaUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "h-fit",
              )}
              onClick={(event) => {
                // Keep beta link independent from card click
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            >
              <FilmIcon />
              Beta
            </a>
          )}
          <span className="flex items-end text-nowrap text-sm font-medium text-muted-foreground">
            <CalendarIcon className="mr-1 h-5 w-5" />
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
