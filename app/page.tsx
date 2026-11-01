import { Benefits } from "@/components/Benefits";
import { CTAForm } from "@/components/CTAForm";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Process } from "@/components/Process";

export default function Home() {
  return (
    <main>
      <div className="hero-surface">
        <Header />
        <Hero />
      </div>
      <Problem />
      <Benefits />
      <Process />
      <CTAForm />
    </main>
  );
}
