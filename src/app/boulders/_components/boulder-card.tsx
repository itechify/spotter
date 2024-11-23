import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import {
  getGradeBackgroundColorClass,
  getGradeBorderColorClass,
} from "../my-ticks/_components/tick-card";
import { ZapIcon } from "lucide-react";

interface BoulderCardProps {
  name: string;
  grade: string;
  url: string;
  sendStatus: "flash" | "sent" | "unsent";
}

export function BoulderCard({
  name,
  grade,
  url,
  sendStatus,
}: BoulderCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-sm border-2",
        sendStatus !== "unsent" && getGradeBackgroundColorClass(grade),
        sendStatus !== "unsent" && getGradeBorderColorClass(grade),
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
            {sendStatus === "flash" && (
              <ZapIcon className="h-6 w-6 fill-current text-yellow-500" />
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
