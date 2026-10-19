const benefits = [
  "Understand why your marketing is not bringing customers",
  "Get a plan made for your business, not a copy-paste template",
  "Know exactly what to do first",
  "Start using the plan right after the call",
  "Stop guessing and stop wasting money on random boosts",
  "Receive your customized plan as a PDF",
];

export function Benefits() {
  return (
    <section className="bg-page py-16 sm:py-24" aria-labelledby="benefits-heading">
      <div className="section-shell">
        <h2 id="benefits-heading" className="mx-auto max-w-2xl text-center text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">How You Benefit From This Consultation</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <article key={benefit} className="relative rounded-3xl border border-brand-border bg-white p-6 shadow-[0_14px_40px_rgb(6_43_80/5%)]">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-light-teal font-extrabold text-dark-teal" aria-hidden="true">✓</span>
              <p className="mt-5 text-base font-bold leading-7 text-navy">{benefit}</p>
              {index === 5 ? <span className="absolute right-5 top-5 h-2 w-2 rounded-full bg-orange" aria-hidden="true" /> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
