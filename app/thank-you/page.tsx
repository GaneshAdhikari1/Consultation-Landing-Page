import type { Metadata } from "next";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Consultation Request Received | Digital Ganesh",
  robots: { index: false, follow: false },
};

const steps = [
  "Watch the short video below.",
  "Message us on WhatsApp so we can confirm your call.",
  "Be ready to tell me about your business and where you're stuck.",
];

function getVimeoEmbedUrl(rawUrl?: string) {
  if (!rawUrl) return null;
  try {
    const url = new URL(rawUrl);
    if (!url.hostname.endsWith("vimeo.com")) return null;
    const videoId = url.pathname.split("/").find((segment) => /^\d+$/.test(segment));
    return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
  } catch {
    return null;
  }
}

export default function ThankYouPage() {
  const vimeoUrl = getVimeoEmbedUrl(process.env.NEXT_PUBLIC_VIMEO_URL);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const validWhatsappNumber = whatsappNumber && /^\d+$/.test(whatsappNumber) ? whatsappNumber : null;

  if (!vimeoUrl) console.warn("NEXT_PUBLIC_VIMEO_URL is missing or invalid; the video is hidden.");
  if (!validWhatsappNumber) console.warn("NEXT_PUBLIC_WHATSAPP_NUMBER is missing or invalid; the WhatsApp button is hidden.");

  const whatsappMessage = "Hi, I just submitted the form for the Free Digital Marketing Consultation. I'd like to know the next steps.";
  const whatsappUrl = validWhatsappNumber
    ? `https://wa.me/${validWhatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  return (
    <main className="hero-surface min-h-screen pb-16">
      <Header />
      <section className="section-shell flex flex-col items-center pt-5 text-center sm:pt-10">
        <span className="fade-up flex h-12 w-12 items-center justify-center rounded-full bg-light-teal text-2xl font-black text-dark-teal" aria-hidden="true">✓</span>
        <h1 className="fade-up mt-5 max-w-3xl text-balance text-[clamp(2.15rem,7vw,4.4rem)] font-extrabold leading-[1.07] tracking-[-0.04em] text-navy">
          Congratulations! Your free consultation request is in.
        </h1>
        <p className="mt-5 text-lg font-semibold text-dark-teal">Here&apos;s what to do next.</p>

        <ol className="mt-9 grid w-full max-w-4xl gap-4 text-left md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step} className="rounded-3xl border border-brand-border bg-white p-5 shadow-[0_12px_36px_rgb(6_43_80/6%)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-light-orange text-lg font-extrabold text-orange" aria-hidden="true">{index + 1}</span>
              <p className="mt-4 font-bold leading-7 text-navy">{step}</p>
            </li>
          ))}
        </ol>

        {vimeoUrl ? (
          <div className="mt-9 aspect-video w-full max-w-4xl overflow-hidden rounded-3xl border border-brand-border bg-deep-navy shadow-[0_20px_60px_rgb(6_43_80/14%)]">
            <iframe
              src={vimeoUrl}
              title="Digital Ganesh consultation next steps"
              className="h-full w-full"
              allow="fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null}

        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-cta mt-8 inline-flex min-h-14 w-full max-w-md items-center justify-center rounded-full bg-whatsapp px-7 py-3 text-base font-extrabold text-[#073B1D] shadow-[0_12px_28px_rgb(6_43_80/16%)] transition hover:-translate-y-0.5 hover:brightness-95"
          >
            Message Us on WhatsApp
          </a>
        ) : null}
      </section>
    </main>
  );
}
