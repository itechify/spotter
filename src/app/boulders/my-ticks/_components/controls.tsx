"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Toggle } from "~/components/ui/toggle";
import { CalendarIcon, Repeat, Search, Star, Zap } from "lucide-react";

type Props = {
  gradeOrder: string[];
};

export function TicksControls({ gradeOrder }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | undefined) {
    const sp = new URLSearchParams(searchParams.toString());
    if (value === undefined || value === "") sp.delete(key);
    else sp.set(key, value);
    router.push(`/boulders/my-ticks?${sp.toString()}`);
  }

  const gradeItems = useMemo(() => gradeOrder, [gradeOrder]);

  return (
    <div className="flex flex-col gap-3 rounded-md border p-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-full md:w-64">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              defaultValue={searchParams.get("q") ?? ""}
              placeholder="Search by boulder name"
              className="pl-8"
              onChange={(e) =>
                updateParam("q", e.currentTarget.value.trim() || undefined)
              }
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Toggle
            aria-label="Only flashes"
            pressed={searchParams.get("flash") === "true"}
            onPressedChange={(p) =>
              updateParam("flash", p ? "true" : undefined)
            }
          >
            <Zap className="mr-1 h-4 w-4" /> Flash
          </Toggle>
          <Toggle
            aria-label="Only repeats"
            pressed={searchParams.get("repeat") === "true"}
            onPressedChange={(p) =>
              updateParam("repeat", p ? "true" : undefined)
            }
          >
            <Repeat className="mr-1 h-4 w-4" /> Repeat
          </Toggle>
          <Toggle
            aria-label="Rated only"
            pressed={searchParams.get("rated") === "true"}
            onPressedChange={(p) =>
              updateParam("rated", p ? "true" : undefined)
            }
          >
            <Star className="mr-1 h-4 w-4" /> Rated
          </Toggle>
          <Toggle
            aria-label="Unrated only"
            pressed={searchParams.get("unrated") === "true"}
            onPressedChange={(p) =>
              updateParam("unrated", p ? "true" : undefined)
            }
          >
            <Star className="mr-1 h-4 w-4" /> Unrated
          </Toggle>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-wrap items-center gap-2 sm:col-span-2 lg:col-span-2">
          <span className="text-sm text-muted-foreground">Grade from</span>
          <Select
            value={searchParams.get("gradeMin") ?? undefined}
            onValueChange={(v) => updateParam("gradeMin", v)}
          >
            <SelectTrigger className="w-full sm:w-28">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              {gradeItems.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">to</span>
          <Select
            value={searchParams.get("gradeMax") ?? undefined}
            onValueChange={(v) => updateParam("gradeMax", v)}
          >
            <SelectTrigger className="w-full sm:w-28">
              <SelectValue placeholder="Max" />
            </SelectTrigger>
            <SelectContent>
              {gradeItems.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:col-span-2 lg:col-span-2">
          <span className="text-sm text-muted-foreground">From</span>
          <div className="relative min-w-[10rem] flex-1">
            <CalendarIcon className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="date"
              className="w-full pl-8"
              defaultValue={searchParams.get("from") ?? undefined}
              onChange={(e) =>
                updateParam("from", e.currentTarget.value || undefined)
              }
            />
          </div>
          <span className="text-sm text-muted-foreground">to</span>
          <div className="relative min-w-[10rem] flex-1">
            <CalendarIcon className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="date"
              className="w-full pl-8"
              defaultValue={searchParams.get("to") ?? undefined}
              onChange={(e) =>
                updateParam("to", e.currentTarget.value || undefined)
              }
            />
          </div>
        </div>

        <div className="col-span-1 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort</span>
          <Select
            value={searchParams.get("sort") ?? "date_desc"}
            onValueChange={(v) => updateParam("sort", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_desc">Newest</SelectItem>
              <SelectItem value="date_asc">Oldest</SelectItem>
              <SelectItem value="grade_desc">Hardest</SelectItem>
              <SelectItem value="grade_asc">Easiest</SelectItem>
              <SelectItem value="rating_desc">Rating high → low</SelectItem>
              <SelectItem value="rating_asc">Rating low → high</SelectItem>
              <SelectItem value="name_asc">Name A → Z</SelectItem>
              <SelectItem value="name_desc">Name Z → A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1 flex items-center gap-2 justify-self-start sm:justify-self-end lg:col-start-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/boulders/my-ticks")}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
