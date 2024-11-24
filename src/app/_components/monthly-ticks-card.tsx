import { getMyMonthlyTickStats } from "~/server/queries";
import { MonthlyTicksChart } from "./monthly-ticks-chart";

// TODO: investigate getting more of the card into this server component
export async function MonthlyTicksCard() {
  const monthlyTickStats = await getMyMonthlyTickStats();

  return <MonthlyTicksChart data={monthlyTickStats} />;
}
