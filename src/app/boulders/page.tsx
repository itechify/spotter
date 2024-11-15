import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getBouldersWithTicks } from "~/server/queries";
import { Badge } from "~/components/ui/badge";
import { auth } from "@clerk/nextjs/server";
import { cn } from "~/lib/utils";

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

export default async function BouldersPage() {
  return (
    <main className="">
      <Boulders />
    </main>
  );
}
