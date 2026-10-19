const steps = [
  { title: "Book your free call.", copy: "Fill out the short form below." },
  { title: "Talk to me one-to-one.", copy: "Tell me about your business and where you're stuck." },
  { title: "Get your customized plan.", copy: "Leave with a digital marketing plan in PDF format you can use immediately." },
];

export function Process() {
  return (
    <section className="bg-light-teal py-16 sm:py-24" aria-labelledby="process-heading">
      <div className="section-shell">
        <h2 id="process-heading" className="text-center text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Consultation Process</h2>
        <ol className="relative mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
          <span className="absolute left-[16.66%] right-[16.66%] top-7 hidden h-px bg-teal/35 md:block" aria-hidden="true" />
          {steps.map((step, index) => (
            <li key={step.title} className="relative rounded-3xl border border-brand-border bg-white p-6 shadow-[0_12px_36px_rgb(6_43_80/5%)]">
              <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-light-orange text-xl font-extrabold text-orange ring-8 ring-light-teal" aria-hidden="true">{index + 1}</span>
              <h3 className="mt-6 text-xl font-extrabold text-navy">{step.title}</h3>
              <p className="mt-2 leading-7 text-muted-ink">{step.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
