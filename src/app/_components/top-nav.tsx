"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { UploadButton } from "~/utils/uploadthing";

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
            <UploadButton
              endpoint="csvUploader"
              className="pr-2"
              content={{
                button({ ready }) {
                  if (ready) return <div>Upload Ticks</div>;
                  return "Loading...";
                },
              }}
              onClientUploadComplete={(res) => {
                // Do something with the response
                console.log("Files: ", res);
                alert("Upload Completed");
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}
