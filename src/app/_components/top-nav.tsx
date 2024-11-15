import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
      <Link
        href={"/"}
        className={cn(
          buttonVariants({ variant: "link", size: "sm" }),
          "text-xl",
        )}
      >
        Spotter
      </Link>
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <div className="flex gap-4">
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}
