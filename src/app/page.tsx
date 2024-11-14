import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { MountainIcon } from "lucide-react";
import { getBoulders } from "~/server/queries";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { auth } from "@clerk/nextjs/server";
import { cn } from "~/lib/utils";

export const dynamic = "force-dynamic";

async function Boulders() {
  const boulders = await getBoulders();

  const userId = (await auth()).userId;

  return (
    <div className="flex flex-wrap justify-center gap-4 px-4">
      {boulders.map((boulder) => (
        <BoulderCard
          key={boulder.id}
          hasSent={boulder.ticks.some((tick) => tick.userId === userId)}
          {...boulder}
        />
      ))}
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
    <Card className={cn("w-full max-w-sm")}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle title={name} className="truncate text-2xl font-bold">
            {name}
          </CardTitle>
          <Badge variant="secondary" className="text-md font-semibold">
            {grade}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="bg-muted flex items-center justify-center rounded-md p-6">
          <MountainIcon className="text-primary h-24 w-24" />
        </div>
        <div className="flex gap-4">
          {hasSent && <Badge className="bg-lime-400 text-sm">Sent</Badge>}
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
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">
          Please sign in above
        </div>
      </SignedOut>
      <SignedIn>
        <Boulders />
      </SignedIn>
    </main>
  );
}
