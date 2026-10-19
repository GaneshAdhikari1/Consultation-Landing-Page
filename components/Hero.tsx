export function Hero() {
  return (
    <section className="section-shell flex min-h-[calc(100svh-9rem)] flex-col items-center justify-center pb-16 pt-4 text-center sm:min-h-[38rem] sm:pb-24 sm:pt-10">
      <div className="fade-up max-w-4xl">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-border bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-navy shadow-sm">
          <span className="h-2 w-2 rounded-full bg-orange" aria-hidden="true" />
          Free AI marketing consultation
        </p>
        <h1 className="text-balance text-[clamp(2.15rem,8.4vw,4.8rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
          Likes aaudai chhan, customer aaudaina? Get a{" "}
          <span className="text-dark-teal">free plan</span> to fix it.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg font-semibold leading-8 text-ink sm:text-xl">
          Book a free 1-hour one-to-one call. Get a customized digital marketing plan in PDF format.
        </p>
      </div>
      <div className="fade-up fade-up-delay mx-auto mt-5 max-w-2xl text-[1.02rem] leading-7 text-muted-ink">
        <p>This is a free AI marketing consultation for small and medium business owners who are struggling to sell.</p>
        <p className="mt-3 font-semibold text-navy">You post. You boost. Still, customers don&apos;t come.</p>
        <p className="mt-3">On this call, we look at your business and build a plan that fits it.</p>
        <a href="#book" className="primary-cta mt-7 sm:min-w-64">Book Free Consultation</a>
      </div>
    </section>
  );
}
