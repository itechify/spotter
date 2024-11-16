// needed to make compatible with light mode? https://github.com/shadcn-ui/ui/pull/2362
export default async function NotFound() {
  return (
    <main className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
      <div className="flex items-center justify-center">
        <h2 className="leading-49 mr-6 border-r border-solid border-muted-foreground pr-6 align-top text-2xl font-semibold text-primary">
          404
        </h2>
        <p className="leading-49 m-0 font-normal text-primary">
          This page could not be found.
        </p>
      </div>
    </main>
  );
}
