import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface BoulderCardProps {
  name: string;
  grade: string;
  url: string;
  sendStatus: "flash" | "sent" | "unsent";
  isClassic: boolean;
}

export function BoulderCard({
  name,
  grade,
  url,
  sendStatus,
  isClassic,
}: BoulderCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-sm border-2",
        sendStatus !== "unsent" && "bg-primary-foreground",
        sendStatus === "flash" && "border-amber-300",
        sendStatus === "sent" && "border-green-600",
      )}
    >
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle title={name} className="truncate text-xl font-bold">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              {name}
            </a>
          </CardTitle>
          <div className="flex gap-1">
            {isClassic && (
              <div className="flex items-center justify-center text-lg font-semibold">
                🌟
              </div>
            )}
            <Badge
              variant="secondary"
              className="text-nowrap text-sm font-semibold"
            >
              {grade}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2"></CardContent>
    </Card>
  );
}
