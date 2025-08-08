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

// TODO: utils file?
export const getGradeBackgroundColorClass = (grade: string) => {
  switch (grade) {
    case "V-easy":
    case "V0":
      return "bg-beginner/10";
    case "V1":
    case "V2":
      return "bg-novice/10";
    case "V3":
    case "V4":
    case "V5":
      return "bg-intermediate/10";
    case "V6":
    case "V7":
    case "V8":
      return "bg-advanced/10";
    case "V9":
    case "V10":
    case "V11":
    case "V12":
      return "bg-expert/10";
    case "V13":
    case "V14":
    case "V15":
    case "V16":
    case "V17":
      return "bg-elite/10";
    default:
      return "bg-beginner/10";
  }
};

// TODO: utils file?
export const getGradeBorderColorClass = (grade: string) => {
  switch (grade) {
    case "V-easy":
    case "V0":
      return "border-beginner";
    case "V1":
    case "V2":
      return "border-novice";
    case "V3":
    case "V4":
    case "V5":
      return "border-intermediate";
    case "V6":
    case "V7":
    case "V8":
      return "border-advanced";
    case "V9":
    case "V10":
    case "V11":
    case "V12":
      return "border-expert";
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

// Hover helpers to amplify the card's background tint and glow color
export const getGradeHoverBackgroundClass = (grade: string) => {
  switch (grade) {
    case "V-easy":
    case "V0":
      return "hover:bg-beginner/20";
    case "V1":
    case "V2":
      return "hover:bg-novice/20";
    case "V3":
    case "V4":
    case "V5":
      return "hover:bg-intermediate/20";
    case "V6":
    case "V7":
    case "V8":
      return "hover:bg-advanced/20";
    case "V9":
    case "V10":
    case "V11":
    case "V12":
      return "hover:bg-expert/20";
    case "V13":
    case "V14":
    case "V15":
    case "V16":
    case "V17":
      return "hover:bg-elite/20";
    default:
      return "hover:bg-beginner/20";
  }
};

export const getGradeRingColorClass = (grade: string) => {
  switch (grade) {
    case "V-easy":
    case "V0":
      return "hover:ring-beginner/50";
    case "V1":
    case "V2":
      return "hover:ring-novice/50";
    case "V3":
    case "V4":
    case "V5":
      return "hover:ring-intermediate/50";
    case "V6":
    case "V7":
    case "V8":
      return "hover:ring-advanced/50";
    case "V9":
    case "V10":
    case "V11":
    case "V12":
      return "hover:ring-expert/50";
    case "V13":
    case "V14":
    case "V15":
    case "V16":
    case "V17":
      return "hover:ring-elite/50";
    default:
      return "hover:ring-beginner/50";
  }
};

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
        "h-fit w-96 min-w-64 border-2 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:ring-2",
        getGradeBackgroundColorClass(boulderGrade),
        getGradeBorderColorClass(boulderGrade),
        getGradeHoverBackgroundClass(boulderGrade),
        getGradeRingColorClass(boulderGrade),
        className,
      )}
    >
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
                  index + 1 <= Number(rating ?? 0)
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
