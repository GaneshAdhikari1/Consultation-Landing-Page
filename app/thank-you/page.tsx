import type { Metadata } from "next";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Consultation Request Received | Digital Ganesh",
  robots: { index: false, follow: false },
};

const steps = [
  "Watch the quick video to understand what happens next.",
  "Send us a WhatsApp message to confirm your request.",
  "Keep a few notes ready about your business, your marketing, and where you feel stuck.",
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

  if (!vimeoUrl) console.warn("NEXT_PUBLIC_VIMEO_URL is missing or invalid; the Vimeo placeholder is shown.");
  if (!validWhatsappNumber) console.warn("NEXT_PUBLIC_WHATSAPP_NUMBER is missing or invalid; the WhatsApp button is hidden.");

  const whatsappMessage = "Hi Digital Ganesh, I just submitted the form for a free digital marketing consultation. Please help me confirm my call and share the next steps.";
  const whatsappUrl = validWhatsappNumber
    ? `https://wa.me/${validWhatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  return (
    <main className="hero-surface min-h-screen pb-16">
      <Header />
      <section className="section-shell flex flex-col items-center pt-5 text-center sm:pt-10">
        <span className="fade-up flex h-12 w-12 items-center justify-center rounded-full bg-light-teal text-2xl font-black text-dark-teal" aria-hidden="true">✓</span>
        <h1 className="fade-up mt-5 max-w-3xl text-balance text-[clamp(2.15rem,7vw,4.4rem)] font-extrabold leading-[1.07] tracking-[-0.04em] text-navy">
          You&apos;re all set—your free consultation request is in.
        </h1>
        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-dark-teal">
          Take these quick steps so we can prepare for a focused, useful call.
        </p>

        <ol className="mt-9 grid w-full max-w-4xl gap-4 text-left md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step} className="rounded-3xl border border-brand-border bg-white p-5 shadow-[0_12px_36px_rgb(6_43_80/6%)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-light-orange text-lg font-extrabold text-orange" aria-hidden="true">{index + 1}</span>
              <p className="mt-4 font-bold leading-7 text-navy">{step}</p>
            </li>
          ))}
        </ol>

        <section className="mt-12 w-full max-w-4xl" aria-labelledby="video-heading">
          <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-orange">Before your call</p>
          <h2 id="video-heading" className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Watch this short video first
          </h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-muted-ink">
            This video explains what to expect and how to get the most value from your free consultation.
          </p>

          {vimeoUrl ? (
            <div className="mt-7 aspect-video w-full overflow-hidden rounded-3xl border border-brand-border bg-deep-navy shadow-[0_20px_60px_rgb(6_43_80/14%)]">
              <iframe
                src={vimeoUrl}
                title="What to expect from your Digital Ganesh consultation"
                className="h-full w-full"
                allow="fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="mt-7 flex aspect-video w-full flex-col items-center justify-center rounded-3xl border border-dashed border-teal/35 bg-white/75 px-6 text-center shadow-[0_16px_44px_rgb(6_43_80/7%)]">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-light-teal text-2xl text-dark-teal" aria-hidden="true">▶</span>
              <p className="mt-4 font-bold text-navy">The consultation video will appear here.</p>
              <p className="mt-1 text-sm text-muted-ink">Add the Vimeo link to activate the player.</p>
            </div>
          )}
        </section>

        {whatsappUrl ? (
          <section className="mt-10 w-full max-w-4xl rounded-[2rem] border border-brand-border bg-white p-6 text-center shadow-[0_18px_54px_rgb(6_43_80/8%)] sm:p-10" aria-labelledby="whatsapp-heading">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F9EE] text-xl font-black text-[#087B35]" aria-hidden="true">✓</span>
            <h2 id="whatsapp-heading" className="mt-4 text-2xl font-extrabold text-navy sm:text-3xl">Confirm your consultation on WhatsApp</h2>
            <p className="mx-auto mt-3 max-w-2xl leading-7 text-muted-ink">
              Send us a quick message now. We&apos;ll confirm your request and share the next steps for your call.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-cta mt-6 inline-flex min-h-14 w-full max-w-md items-center justify-center rounded-full bg-whatsapp px-7 py-3 text-base font-extrabold text-[#073B1D] shadow-[0_12px_28px_rgb(6_43_80/16%)] transition hover:-translate-y-0.5 hover:brightness-95"
            >
              Confirm My Call on WhatsApp
            </a>
            <p className="mt-3 text-sm text-muted-ink">Opens WhatsApp with a ready-to-send message.</p>
          </section>
        ) : null}
      </section>
    </main>
  );
}
