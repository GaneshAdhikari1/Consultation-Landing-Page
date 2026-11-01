export function Hero() {
  return (
    <section className="section-shell grid min-h-[calc(100svh-8rem)] items-center gap-14 pb-16 pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 lg:pb-24 lg:pt-12">
      <div className="fade-up max-w-3xl">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ffc400]/45 bg-[#ffc400]/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#ffd440]">
          <span className="text-base leading-none" aria-hidden="true">✦</span>
          Free one-to-one consultation
        </p>
        <h1 className="text-balance text-[clamp(2.75rem,7.5vw,5.25rem)] font-extrabold leading-[0.98] tracking-[-0.055em] text-white">
          Struggling to get <span className="text-[#ffc400]">customers online?</span>
        </h1>
        <p className="mt-7 max-w-2xl text-pretty text-[clamp(1.35rem,3vw,2rem)] font-extrabold leading-tight text-[#ffc400]">
          Get a customized digital marketing plan for your business.
        </p>
        <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-white/72 sm:text-lg">
          Book a free 1-hour one-to-one call. Get a customized digital marketing plan in PDF format—built around your business, your audience, and your next best steps.
        </p>

        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <a href="#book" className="hero-primary-cta">
            Book My Free Consultation
            <span aria-hidden="true">→</span>
          </a>
          <p className="text-sm font-semibold leading-5 text-white/55">100% free<br />No generic template</p>
        </div>

        <ul className="mt-8 grid gap-3 text-sm font-bold text-white/85 sm:grid-cols-3" aria-label="What is included">
          {["60-minute call", "Personalized PDF", "Clear next steps"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ffc400] text-[0.7rem] font-black text-[#08090c]" aria-hidden="true">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="fade-up fade-up-delay relative mx-auto w-full max-w-[28rem] lg:mr-2">
        <div className="hero-plan-glow" aria-hidden="true" />
        <aside className="hero-plan-card" aria-label="Preview of your customized digital marketing plan">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.17em] text-black/70">Your customized growth plan</p>
              <p className="mt-5 text-[clamp(4.6rem,15vw,7.5rem)] font-black leading-[0.74] tracking-[-0.08em] text-[#090a0d]">PDF</p>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-black/15 bg-white/35 text-2xl font-black text-black" aria-hidden="true">↗</div>
          </div>
          <h2 className="mt-7 max-w-xs text-2xl font-black uppercase leading-[1.02] tracking-[-0.035em] text-black sm:text-3xl">
            Digital marketing action plan
          </h2>
          <div className="my-6 h-px bg-black/18" />
          <ul className="space-y-3.5 text-base font-extrabold text-black">
            {["Marketing review", "Customer opportunities", "Clear next steps"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="text-lg" aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-7 text-xs font-black uppercase tracking-[0.15em] text-black/55">Prepared after your free 1-hour call</p>
        </aside>
        <div className="hero-plan-shadow" aria-hidden="true" />
      </div>
    </section>
  );
}
