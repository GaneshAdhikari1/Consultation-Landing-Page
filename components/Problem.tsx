const problems = ["You post.", "You boost.", "Still, customers don't come."];

export function Problem() {
  return (
    <section className="bg-deep-navy py-16 sm:py-20" aria-labelledby="problem-heading">
      <div className="section-shell">
        <h2 id="problem-heading" className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Sound familiar?</h2>
        <div className="mx-auto mt-9 grid max-w-4xl gap-3 sm:grid-cols-3">
          {problems.map((problem) => (
            <p key={problem} className="flex min-h-20 items-center rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-lg font-bold text-white">
              <span className="mr-3 h-2.5 w-2.5 shrink-0 rounded-full bg-orange" aria-hidden="true" />
              {problem}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
