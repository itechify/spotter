"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { UploadDropzone } from "~/utils/uploadthing";

export const dynamic = "force-dynamic";

export default function ImportPage() {
  const router = useRouter();

  const posthog = usePostHog();

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
            onUploadBegin={() => {
              posthog.capture("Tick CSV Upload Begin");
              toast(
                <div className="flex items-center gap-2">
                  <LoadingSpinner className="h-4 w-4" />
                  <span>Uploading...</span>
                </div>,
                {
                  duration: 100000,
                  id: "upload-begin",
                },
              );
            }}
            onClientUploadComplete={() => {
              toast.dismiss("upload-begin");
              toast(
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4" />
                  <span>Ticks successfully uploaded!</span>
                </div>,
              );
              router.refresh();
            }}
            className="border-primary/50"
            config={{
              mode: "auto",
            }}
          />
        </div>
      </SignedIn>
    </>
  );
}
