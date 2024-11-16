"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "~/utils/uploadthing";

export const dynamic = "force-dynamic";

export default function ImportPage() {
  const router = useRouter();

  return (
    <>
      <SignedOut>
        <div className="flex h-96 w-full items-center justify-center text-2xl">
          Sign in to import your ticks!
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex h-96 w-full flex-col items-center justify-center gap-4">
          <div className="flex w-96 flex-col gap-2 text-center">
            <p>Import your ticks CSV from Mountain Project here!</p>
            <a
              href="https://www.mountainproject.com/user/201260292/jeffrey-davis/ticks"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary underline underline-offset-4"
            >
              Example for where this can be found.
            </a>
          </div>
          <UploadDropzone
            endpoint={"csvUploader"}
            onClientUploadComplete={() => {
              router.refresh();
            }}
            className="border-2 border-dashed border-primary/50"
          />
        </div>
      </SignedIn>
    </>
  );
}
