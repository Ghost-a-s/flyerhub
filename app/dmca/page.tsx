export default function DmcaPage() {
  return (
    <main className="container-page max-w-3xl py-14 sm:py-20">
      <p className="eyebrow">A.T policy</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
        DMCA notices.
      </h1>
      <p className="mt-5 text-base leading-7 text-slate-500">
        A.T respects intellectual property rights and responds to valid notices
        under applicable law.
      </p>
      <section className="mt-10 rounded-xl border border-line bg-white p-6 text-sm leading-7 text-slate-600">
        <h2 className="font-display text-2xl font-bold text-navy">
          Designated contact
        </h2>
        <p className="mt-3">
          Send notices to{" "}
          <a
            className="font-bold text-cobalt"
            href="mailto:dmca@at-psd.example"
          >
            dmca@at-psd.example
          </a>{" "}
          with your signature, identification of the copyrighted work, the
          allegedly infringing URL, your contact information, and a good-faith
          statement that the use is unauthorized.
        </p>
        <p className="mt-5">
          This page contains a product placeholder contact for development.
          Replace it with reviewed agent details before public launch.
        </p>
      </section>
    </main>
  );
}
