"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UploadButton } from "~/utils/uploadthing";

export const dynamic = "force-dynamic";

export default function ImportPage() {
  const router = useRouter();

  return (
    <main className="">
      <SignedOut>
        <div className="flex h-96 w-full items-center justify-center text-2xl">
          Sign in to import your ticks!
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex h-96 w-full items-center justify-center">
          <UploadButton
            endpoint="csvUploader"
            className="pr-2"
            onClientUploadComplete={() => {
              router.refresh();
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>
      </SignedIn>
    </main>
  );
}
