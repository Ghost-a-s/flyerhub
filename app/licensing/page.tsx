export default function LicensingPage() {
  return (
    <main className="container-page max-w-4xl py-14 sm:py-20">
      <p className="eyebrow">A.T policy</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
        Licensing, made plain.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500">
        Every template shows its license before you download. This is a
        practical summary, not a substitute for legal advice.
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        <section className="rounded-xl border border-line bg-white p-6">
          <h2 className="font-display text-xl font-bold text-navy">
            Personal license
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use templates in personal projects, portfolios, learning, and
            non-commercial experiments. You may edit the files for your own use.
          </p>
        </section>
        <section className="rounded-xl border border-line bg-white p-6">
          <h2 className="font-display text-xl font-bold text-navy">
            Commercial license
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use templates in client work, products, campaigns, and other
            revenue-generating work. One license covers your own commercial use.
          </p>
        </section>
      </div>
      <section className="mt-10 space-y-6 text-sm leading-7 text-slate-600">
        <div>
          <h2 className="font-display text-xl font-bold text-navy">
            You may not
          </h2>
          <p className="mt-2">
            Resell or redistribute the original files, upload them to another
            asset library, claim authorship of unmodified work, or use a
            template to create a competing downloadable template.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-navy">
            Contributors
          </h2>
          <p className="mt-2">
            Contributors confirm they own or have permission to distribute their
            uploads. A.T may remove a listing when ownership or license status
            is unclear.
          </p>
        </div>
      </section>
    </main>
  );
}
