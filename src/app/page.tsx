import { type Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { MountainSnowIcon } from "lucide-react";
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import TotalBouldersCard from "./_components/total-boulders-card";
import { getMyMonthlyTickStats } from "~/server/queries";
import { MonthlyTicksChart } from "./_components/monthly-ticks-chart";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function DashboardPage() {
  const monthlyTickStats = await getMyMonthlyTickStats();

  return (
    <>
      <SignedIn>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Spotter</h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">My Overview</TabsTrigger>
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
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <TotalBouldersCard />
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sport</CardTitle>
                    <MountainSnowIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Todo</div>
                    <p className="text-sm text-muted-foreground">
                      coming soon...
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
                <div className="col-span-4">
                  <MonthlyTicksChart data={monthlyTickStats} />
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
