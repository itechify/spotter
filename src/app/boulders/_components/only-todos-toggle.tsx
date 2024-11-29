"use client";

import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Toggle } from "~/components/ui/toggle";

export function OnlyTodosToggle() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const onlyTodos = searchParams.get("onlyTodos");

  return (
    <Toggle
      aria-label="Toggle showing only todos"
      onPressedChange={(pressed) => {
        router.push(`/boulders?${pressed ? "onlyTodos=true" : ""}`);
      }}
    >
      {onlyTodos ? <SquareCheckIcon /> : <SquareIcon />}
      Only To-Dos
    </Toggle>
  );
}
