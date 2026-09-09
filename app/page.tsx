import Link from "next/link";
export default function HomePage() {
  return (
    <main className="container-page py-20 sm:py-28">
      <p className="eyebrow">A.T creative library</p>
      <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold tracking-tight sm:text-7xl">
        A durable home for editable PSDs, visual references, and design
        requests.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
        Submit your original work, share inspiration with designers, or publish
        a brief with your preferred contact link.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link href="/templates" className="button-primary">
          Explore the library
        </Link>
        <Link href="/contributor" className="button-quiet">
          Submit content
        </Link>
      </div>
    </main>
  );
}
