"use client";

import { useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type UserSelectProps = {
  data: { id: string; name: string }[];
};

export function UserSelect({ data }: UserSelectProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user: currentUser } = useUser();

  return (
    <Select
      value={searchParams.get("userId") ?? ""}
      onValueChange={(value) => {
        router.push(`?userId=${value}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Users" />
      </SelectTrigger>
      <SelectContent>
        {data.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.name} {currentUser?.id === user.id && "(You)"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
