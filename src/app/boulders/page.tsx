import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getBouldersWithTicks } from "~/server/queries";
import { Button } from "~/components/ui/button";
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
        return (
          <BoulderCard
            key={boulder.id}
            hasSent={boulder.ticks.some((tick) => tick.userId === userId)}
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
}

function BoulderCard({ name, grade, url, hasSent }: BoulderCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-sm",
        hasSent && "border-green-600 bg-primary-foreground",
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-center gap-2">
          <CardTitle title={name} className="truncate text-2xl font-bold">
            {name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-center gap-1">
          <Badge variant="secondary" className="text-md font-semibold">
            {grade}
          </Badge>
        </div>
        <Button asChild className="w-full">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline"
          >
            View Problem
            <span className="sr-only">View details for {name}</span>
          </a>
        </Button>
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
