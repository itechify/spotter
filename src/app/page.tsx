import { type Metadata } from "next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { BoulderTotalsCard } from "./_components/boulder-totals-card";
import { HardestBoulderSendCard } from "./_components/hardest-boulder-send-card";
import { BoulderGradeBreakdownCard } from "./_components/boulder-grade-breakdown-card";
import { LatestTicksCard } from "./_components/latest-ticks-card";
import { MonthlyTicksCard } from "./_components/monthly-ticks-card";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { UserSelect } from "./_components/user-select";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Spotter Dashboard",
  description: "The main dashboard for the Spotter app.",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const authUser = await auth();
  const clerk = await clerkClient();
  const userId = (await searchParams).userId ?? authUser.userId;

  const userInfo = userId ? await clerk.users.getUser(userId) : null;

  const userList = await clerk.users.getUserList();

  /*
  const userList = await clerk.users.getUserList({
    userId: [`-${authUser.userId}`],
  });
  */

  return (
    <>
      <SignedIn>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              {`${userInfo?.firstName}'s Spotter`}
            </h2>
            <UserSelect
              data={userList.data.map((user) => ({
                id: user.id,
                name: user.fullName ?? "",
              }))}
            />
          </div>
          <Tabs defaultValue="bouldering" className="space-y-4">
            <TabsList>
              <TabsTrigger value="bouldering">Bouldering</TabsTrigger>
              <TabsTrigger value="sport" disabled>
                Sport (Todo)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="bouldering" className="space-y-4">
              <div className="grid gap-4 xl:grid-cols-3">
                <BoulderTotalsCard userId={userId!} />
                <HardestBoulderSendCard userId={userId!} />
                <BoulderGradeBreakdownCard userId={userId!} />
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-8">
                <div className="col-span-4">
                  <MonthlyTicksCard userId={userId!} />
                </div>
                <div className="col-span-4">
                  <LatestTicksCard userId={userId!} />
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
