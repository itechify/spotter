import { getMonthlyTickStats } from "~/server/queries";
import { MonthlyTicksChart } from "./monthly-ticks-chart";

type MonthlyTicksCardProps = {
  userId: string;
};

// TODO: investigate getting more of the card into this server component
/**
 * A card that shows the monthly ticks for the year / all time for a user.
 */
export async function MonthlyTicksCard({ userId }: MonthlyTicksCardProps) {
  const monthlyTickStats = await getMonthlyTickStats(userId);

  return <MonthlyTicksChart data={monthlyTickStats} />;
}
