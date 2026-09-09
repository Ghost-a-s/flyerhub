export default function CopyrightPage() {
  return (
    <main className="container-page max-w-3xl py-14 sm:py-20">
      <p className="eyebrow">A.T policy</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
        Copyright and ownership.
      </h1>
      <div className="mt-10 space-y-8 text-sm leading-7 text-slate-600">
        <section>
          <h2 className="font-display text-2xl font-bold text-navy">
            Original work matters here
          </h2>
          <p className="mt-3">
            A.T is an independent platform. The A.T name, identity, and
            interface are original project branding. Template authors retain
            ownership of their work unless a separate agreement says otherwise.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold text-navy">
            Report a concern
          </h2>
          <p className="mt-3">
            If you believe a listing infringes your copyright, send the listing
            URL, a description of the original work, and your contact details to{" "}
            <a
              className="font-bold text-cobalt"
              href="mailto:copyright@at-psd.example"
            >
              copyright@at-psd.example
            </a>
            . We review complete reports promptly.
          </p>
        </section>
      </div>
    </main>
  );
}
