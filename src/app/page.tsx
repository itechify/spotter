import { SignedIn, SignedOut } from "@clerk/nextjs";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

async function Boulders() {
  const boulders = await db.query.boulders.findMany();

  return (
    <div className="flex flex-wrap gap-4 px-4">
      {[...boulders].map((boulder, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="h-16 w-16 rounded-lg bg-gray-200"></div>
            <div className="flex flex-col gap-1">
              <div className="text-xl font-bold">{boulder.name}</div>
              <div className="text-sm text-gray-500">
                {boulder.grade} / {boulder.rating} stars
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={boulder.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline"
            >
              {boulder.url}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function HomePage() {
  return (
    <main className="">
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">
          Please sign in above
        </div>
      </SignedOut>
      <SignedIn>
        <Boulders />
      </SignedIn>
    </main>
  );
}
