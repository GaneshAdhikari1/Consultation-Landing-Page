export function Hero() {
  return (
    <section className="section-shell grid min-h-[calc(100svh-8rem)] items-center gap-14 pb-16 pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 lg:pb-24 lg:pt-12">
      <div className="fade-up max-w-3xl">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-border bg-white/85 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-navy shadow-sm">
          <span className="h-2 w-2 rounded-full bg-orange" aria-hidden="true" />
          Free AI marketing consultation
        </p>
        <h1 className="text-balance text-[clamp(2.75rem,7.5vw,5.25rem)] font-extrabold leading-[0.98] tracking-[-0.055em] text-navy">
          Likes aaudai chhan, customer aaudaina? Get a <span className="text-dark-teal">free plan</span> to fix it.
        </h1>
        <p className="mt-7 max-w-2xl text-pretty text-lg font-extrabold leading-8 text-navy sm:text-xl">
          Book a free 1-hour one-to-one call. Get a customized digital marketing plan in PDF format.
        </p>

        <div className="mt-6 max-w-2xl space-y-3 text-base leading-7 text-muted-ink">
          <p>This is a free AI marketing consultation for small and medium business owners who are struggling to sell.</p>
          <p className="font-semibold text-navy">You post. You boost. Still, customers don&apos;t come.</p>
          <p>On this call, we look at your business and build a plan that fits it.</p>
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <a href="#book" className="primary-cta gap-3">
            Book Free Consultation
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="fade-up fade-up-delay relative mx-auto w-full max-w-[28rem] lg:mr-2">
        <div className="hero-plan-glow" aria-hidden="true" />
        <aside className="hero-plan-card" aria-label="Preview of your customized digital marketing plan">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.17em] text-navy/65">Your customized growth plan</p>
              <p className="mt-5 text-[clamp(4.6rem,15vw,7.5rem)] font-black leading-[0.74] tracking-[-0.08em] text-dark-teal">PDF</p>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-orange/20 bg-light-orange text-2xl font-black text-orange" aria-hidden="true">↗</div>
          </div>
          <h2 className="mt-7 max-w-xs text-2xl font-black uppercase leading-[1.02] tracking-[-0.035em] text-navy sm:text-3xl">
            Digital marketing action plan
          </h2>
          <div className="my-6 h-px bg-brand-border" />
          <ul className="space-y-3.5 text-base font-extrabold text-navy">
            {["Marketing review", "Customer opportunities", "Clear next steps"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="text-lg text-dark-teal" aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-7 text-xs font-black uppercase tracking-[0.15em] text-muted-ink">Prepared after your free 1-hour call</p>
        </aside>
        <div className="hero-plan-shadow" aria-hidden="true" />
      </div>
    </section>
  );
}
