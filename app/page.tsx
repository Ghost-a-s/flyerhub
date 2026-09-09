import Image from "next/image";
import Link from "next/link";
export default function HomePage() {
  return (
    <main className="container-page py-16 sm:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(28rem,36rem)] lg:gap-16">
        <div>
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
        </div>
        <figure className="mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-slate-900/10 bg-gradient-to-br from-orange-100 via-white to-blue-100 p-2 shadow-[0_32px_80px_-28px_rgba(15,23,42,0.55)] lg:mx-0 lg:justify-self-end">
          <div className="overflow-hidden rounded-[1.5rem] bg-white">
            <Image
              src="/featured/at-design-brand-print.jpg"
              alt="A.T Design, Brand and Print services flyer"
              width={1053}
              height={1500}
              priority
              sizes="(min-width: 1024px) 36rem, (min-width: 640px) 32rem, 100vw"
              className="h-auto w-full object-cover"
            />
          </div>
          <figcaption className="px-4 pb-3 pt-4 text-sm font-medium text-slate-600">
            A.T Design, Brand &amp; Print
          </figcaption>
        </figure>
      </div>
    </main>
  );
}
