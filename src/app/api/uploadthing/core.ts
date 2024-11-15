import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "~/server/db";
import Papa from "papaparse";
import { boulders, ticks } from "~/server/db/schema";

const f = createUploadthing();

interface MountainProjectCSVEntry {
  Date: string;
  Route: string;
  Rating: string;
  URL: string;
  "Avg Stars": number;
  "Your Stars": number;
  Style: string;
  "Route Type": string;
  "Your Rating": string | null;
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  csvUploader: f({ "text/csv": { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const user = await auth();

      // If you throw, the user will not be able to upload
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!user.userId) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      const response = await fetch(file.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch the file at ${file.url}`);
      }

      const tickData = await response.text();
      const parsedData = Papa.parse<MountainProjectCSVEntry>(tickData, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      });

      const existingBoulders = await db.query.boulders.findMany({
        orderBy: (boulder, { desc }) => desc(boulder.grade),
      });

      // Fetch all existing ticks for the current user
      const existingTicks = await db.query.ticks.findMany({
        where: (tick, { eq }) => eq(tick.userId, metadata.userId),
      });

      const tickEntries = [];

      for (const entry of parsedData.data) {
        if (
          entry["Route Type"]?.includes("Boulder") &&
          ["Send", "Flash"].includes(entry.Style)
        ) {
          let boulder = existingBoulders.find((eb) => eb.url === entry.URL);

          // If boulder doesn't exist, insert it and retrieve the ID
          if (!boulder) {
            const result = await db
              .insert(boulders)
              .values({
                name: entry.Route,
                url: entry.URL,
                grade: entry.Rating,
              })
              .returning();

            boulder = result[0];
            if (boulder) {
              existingBoulders.push(boulder);
            }
          }

          if (boulder) {
            // Only add the tick entry if it doesn't already exist
            if (
              !existingTicks.find(
                (tick) =>
                  tick.date === entry.Date &&
                  tick.userId === metadata.userId &&
                  tick.boulderId === boulder.id,
              )
            ) {
              tickEntries.push({
                boulderId: boulder.id,
                userId: metadata.userId,
                rating: String(entry["Your Stars"]),
                date: entry.Date,
              });
            }
          }
        }
      }

      if (tickEntries.length > 0) {
        await db.insert(ticks).values(tickEntries);
      }

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;