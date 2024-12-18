import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import {
  getGradeBackgroundColorClass,
  getGradeBorderColorClass,
} from "../my-ticks/_components/tick-card";
import { BookmarkIcon, ZapIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { addTodo, removeTodo } from "~/server/queries";

interface BoulderCardProps {
  id: number;
  name: string;
  grade: string;
  url: string;
  sendStatus: "flash" | "sent" | "unsent";
  isTodo: boolean;
}

export function BoulderCard({
  id,
  name,
  grade,
  url,
  sendStatus,
  isTodo,
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
          <div className="flex h-10 items-center gap-1">
            {sendStatus === "unsent" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <form
                      action={async () => {
                        "use server";

                        if (isTodo) {
                          await removeTodo(id);
                        } else {
                          await addTodo(id);
                        }
                      }}
                    >
                      <Button type="submit" variant="ghost" size="icon">
                        <BookmarkIcon
                          className={cn("!h-5 !w-5", isTodo && "fill-primary")}
                        />
                      </Button>
                    </form>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isTodo ? "Remove from To-Do List" : "Add to To-Do List"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
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
