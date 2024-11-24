import { type Metadata } from "next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { BoulderTotalsCard } from "./_components/boulder-totals-card";
import { HardestBoulderSendCard } from "./_components/hardest-boulder-send-card";
import { BoulderGradeBreakdownCard } from "./_components/boulder-grade-breakdown-card";
import { LatestTicksCard } from "./_components/latest-ticks-card";
import { MonthlyTicksCard } from "./_components/monthly-ticks-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Spotter Dashboard",
  description: "The main dashboard for the Spotter app.",
};

export default async function DashboardPage() {
  return (
    <>
      <SignedIn>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">My Spotter</h2>
          </div>
          <Tabs defaultValue="bouldering" className="space-y-4">
            <TabsList>
              <TabsTrigger value="bouldering">Bouldering</TabsTrigger>
              <TabsTrigger value="todo1" disabled>
                Todo 1
              </TabsTrigger>
              <TabsTrigger value="todo2" disabled>
                Todo 2
              </TabsTrigger>
              <TabsTrigger value="todo3" disabled>
                Todo 3
              </TabsTrigger>
            </TabsList>
            <TabsContent value="bouldering" className="space-y-4">
              <div className="grid gap-4 xl:grid-cols-3">
                <BoulderTotalsCard />
                <HardestBoulderSendCard />
                <BoulderGradeBreakdownCard />
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-8">
                <div className="col-span-4">
                  <MonthlyTicksCard />
                </div>
                <div className="col-span-4">
                  <LatestTicksCard />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SignedIn>
      <SignedOut>
        <h2 className="text-center text-4xl font-bold tracking-tight md:mt-40">
          Spotter
        </h2>
        <div className="flex h-96 w-full items-center justify-center">
          <SignIn routing="hash" />
        </div>
      </SignedOut>
    </>
  );
}
