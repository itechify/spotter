import { CalendarIcon, FilmIcon, Repeat, Star, Zap } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

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
    <Card className={cn("h-fit w-full max-w-sm border-2", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle title={boulderName} className="truncate text-xl font-bold">
            <a
              href={boulderUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              {boulderName}
            </a>
          </CardTitle>
          <div className="flex gap-1">
            {repeat && (
              <Repeat
                className="h-6 w-6 fill-current text-lime-500"
                aria-label="Repeat"
              />
            )}
            {flash && (
              <Zap
                className="h-6 w-6 fill-current text-yellow-500"
                aria-label="Flash"
              />
            )}
            <Badge
              variant="secondary"
              className="text-nowrap text-sm font-semibold"
            >
              {boulderGrade}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex justify-between gap-2">
        <div className="flex w-fit flex-col gap-1">
          <div className="flex w-fit gap-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <Star
                key={index}
                className={`h-5 w-5 ${
                  rating && String(index) < rating
                    ? "fill-current text-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-center text-sm font-medium text-muted-foreground">
            {ratingLabels[parseInt(rating ?? "0", 10) - 1] ?? "Unrated"}
          </div>
        </div>
        <div
          className={cn("flex w-fit flex-col gap-1", !betaUrl && "justify-end")}
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
            >
              <FilmIcon />
              Beta
            </a>
          )}
          <span className="flex items-end text-sm font-medium text-muted-foreground">
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
