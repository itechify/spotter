import { Repeat, Star, Zap } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface TickCardProps {
  boulderName: string;
  boulderGrade: string;
  boulderUrl: string;
  rating: string;
  date: string;
  flash: boolean;
  repeat: boolean;
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
}: TickCardProps) {
  return (
    <Card className={cn("w-full max-w-sm border-2")}>
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
                  String(index) < rating
                    ? "fill-current text-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-center text-sm font-medium">
            {ratingLabels[parseInt(rating, 10) - 1] ?? "Unrated"}
          </div>
        </div>
        <span className="flex items-end text-sm font-medium text-muted-foreground">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </CardContent>
    </Card>
  );
}
