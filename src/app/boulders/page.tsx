import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getBouldersWithTicks } from "~/server/queries";
import { Button, buttonVariants } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { auth } from "@clerk/nextjs/server";
import { cn } from "~/lib/utils";
import { Link, LinkIcon } from "lucide-react";

export const dynamic = "force-dynamic";

async function Boulders() {
  const boulders = await getBouldersWithTicks();

  const userId = (await auth()).userId;

  return (
    <div className="flex flex-wrap justify-center gap-4 px-4">
      {boulders.map((boulder) => {
        const tick = boulder.ticks.find((tick) => tick.userId === userId);
        return (
          <BoulderCard
            key={boulder.id}
            hasSent={tick !== undefined}
            isClassic={Number(tick?.rating) > 3}
            {...boulder}
          />
        );
      })}
    </div>
  );
}

interface BoulderCardProps {
  name: string;
  grade: string;
  url: string;
  hasSent: boolean;
  isClassic: boolean;
}

function BoulderCard({
  name,
  grade,
  url,
  hasSent,
  isClassic,
}: BoulderCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-sm",
        hasSent && "border-green-600 bg-primary-foreground",
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle title={name} className="truncate text-2xl font-bold">
            {name}
          </CardTitle>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "flex-shrink-0",
            )}
          >
            <LinkIcon />
            <span className="sr-only">View details for {name}</span>
          </a>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex gap-1">
          <Badge variant="secondary" className="text-md font-semibold">
            {grade}
          </Badge>
          {isClassic && (
            <Badge variant="outline" className="text-md font-semibold">
              🌟
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function HomePage() {
  return (
    <main className="">
      <Boulders />
    </main>
  );
}
