import { getTicks } from "~/server/queries";
import { auth } from "@clerk/nextjs/server";
import { TicksControls, TicksSummary, TickCard } from "./_components";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// Grade helpers for comparisons and sorting
const gradeOrder = [
  "V-easy",
  "V0",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
  "V7",
  "V8",
  "V9",
  "V10",
  "V11",
  "V12",
  "V13",
  "V14",
  "V15",
  "V16",
  "V17",
] as const;

function gradeIndex(grade: string): number {
  const idx = gradeOrder.indexOf(grade as (typeof gradeOrder)[number]);
  return idx === -1 ? 0 : idx;
}

export default async function MyBoulderTicksPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const userId = (await auth()).userId;
  if (!userId) {
    return (
      <div className="p-4">
        <div className="mx-auto max-w-5xl p-8 text-center text-sm text-muted-foreground">
          Please sign in to view your ticks.
        </div>
      </div>
    );
  }

  const ticks = await getTicks(userId);

  // Preprocess to determine if a tick is a repeat
  const boulderFirstTicks = new Map<number, string>();

  ticks.forEach((tick) => {
    if (!boulderFirstTicks.has(tick.boulder.id)) {
      boulderFirstTicks.set(tick.boulder.id, tick.date);
    } else if (
      new Date(tick.date) < new Date(boulderFirstTicks.get(tick.boulder.id)!)
    ) {
      boulderFirstTicks.set(tick.boulder.id, tick.date);
    }
  });

  const ticksWithRepeatFlag = ticks.map((tick) => ({
    ...tick,
    repeat:
      new Date(tick.date) > new Date(boulderFirstTicks.get(tick.boulder.id)!),
  }));

  // Parse search params
  const sp = await searchParams;
  const q = (sp.q as string | undefined)?.toLowerCase()?.trim();
  const onlyFlash = sp.flash === "true";
  const onlyRepeat = sp.repeat === "true";
  const rated = sp.rated === "true";
  const unrated = sp.unrated === "true";
  const gradeMin = sp.gradeMin as string | undefined;
  const gradeMax = sp.gradeMax as string | undefined;
  const from = sp.from as string | undefined; // YYYY-MM-DD
  const to = sp.to as string | undefined; // YYYY-MM-DD
  const sort = (sp.sort as string | undefined) ?? "date_desc";

  // Determine rating filter mode
  const ratingFilterMode: "all" | "rated" | "unrated" =
    rated === unrated ? "all" : rated ? "rated" : "unrated";

  // Apply filtering
  let filtered = ticksWithRepeatFlag.filter((t) => {
    if (q && !t.boulder.name.toLowerCase().includes(q)) return false;
    if (onlyFlash && !t.flash) return false;
    if (onlyRepeat && !t.repeat) return false;
    if (
      ratingFilterMode === "rated" &&
      (t.rating == null || Number(t.rating) === 0)
    )
      return false;
    if (
      ratingFilterMode === "unrated" &&
      t.rating != null &&
      Number(t.rating) > 0
    )
      return false;
    if (gradeMin && gradeIndex(t.boulder.grade) < gradeIndex(gradeMin))
      return false;
    if (gradeMax && gradeIndex(t.boulder.grade) > gradeIndex(gradeMax))
      return false;
    if (from && new Date(t.date) < new Date(from)) return false;
    if (to && new Date(t.date) > new Date(to)) return false;
    return true;
  });

  // Sorting
  filtered = [...filtered].sort((a, b) => {
    switch (sort) {
      case "date_asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "date_desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "grade_asc":
        return gradeIndex(a.boulder.grade) - gradeIndex(b.boulder.grade);
      case "grade_desc":
        return gradeIndex(b.boulder.grade) - gradeIndex(a.boulder.grade);
      case "rating_asc":
        return Number(a.rating ?? 0) - Number(b.rating ?? 0);
      case "rating_desc":
        return Number(b.rating ?? 0) - Number(a.rating ?? 0);
      case "name_asc":
        return a.boulder.name.localeCompare(b.boulder.name);
      case "name_desc":
        return b.boulder.name.localeCompare(a.boulder.name);
      default:
        return 0;
    }
  });

  // Summary stats (overall)
  const totalCount = ticksWithRepeatFlag.length;
  const flashCount = ticksWithRepeatFlag.filter((t) => t.flash).length;
  const repeatCount = ticksWithRepeatFlag.filter((t) => t.repeat).length;
  const hardest = ticksWithRepeatFlag.reduce(
    (max, t) =>
      gradeIndex(t.boulder.grade) > gradeIndex(max) ? t.boulder.grade : max,
    "V-easy",
  );
  const last30Count = ticksWithRepeatFlag.filter((t) => {
    const d = new Date(t.date).getTime();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return d >= thirtyDaysAgo;
  }).length;

  return (
    <div className="p-4">
      <div className="mx-auto mb-4 px-2">
        <TicksSummary
          totalCount={totalCount}
          flashCount={flashCount}
          repeatCount={repeatCount}
          hardestGrade={hardest}
          last30Count={last30Count}
          filteredCount={filtered.length}
        />
      </div>

      <div className="mx-auto mb-6 px-2">
        <TicksControls gradeOrder={gradeOrder as unknown as string[]} />
      </div>

      <div className="flex flex-wrap justify-center gap-4 px-4">
        {filtered.map((tick) => {
          return (
            <TickCard
              key={tick.id}
              boulderName={tick.boulder.name}
              boulderGrade={tick.boulder.grade}
              boulderUrl={tick.boulder.url}
              rating={tick.rating}
              date={tick.date}
              flash={tick.flash}
              repeat={tick.repeat}
              betaUrl={tick.betaUrl}
            />
          );
        })}
      </div>
    </div>
  );
}
