import { db } from "~/server/db";

export default async function HomePage() {
  const posts = await db.query.posts.findMany();
  console.log(posts);

  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        <span>Hello (spotter list in progress)</span>
      </div>
    </main>
  );
}
