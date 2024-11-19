import { type Metadata } from "next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import TotalBouldersCard from "./_components/total-boulders-card";
import { getMyMonthlyTickStats } from "~/server/queries";
import { MonthlyTicksChart } from "./_components/monthly-ticks-chart";
import { HighestSendCard } from "./_components/highest-send-card";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { PickaxeIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Spotter Dashboard",
  description: "The main dashboard for the Spotter app.",
};

// TODO: this seems hacky, but it works for now
async function MonthlyTicksChartWrapper() {
  const monthlyTickStats = await getMyMonthlyTickStats();
  return <MonthlyTicksChart data={monthlyTickStats} />;
}

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
                <TotalBouldersCard />
                <HighestSendCard />
                <Card className="flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Other Stat
                    </CardTitle>
                    <PickaxeIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="flex h-full flex-col items-center justify-center gap-1 text-center">
                    <div className="text-4xl font-bold">Todo</div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-8">
                <div className="col-span-4">
                  <MonthlyTicksChartWrapper />
                </div>
                <div className="col-span-4">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Other Graph</CardTitle>
                    </CardHeader>
                    <CardContent>Todo</CardContent>
                  </Card>
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
