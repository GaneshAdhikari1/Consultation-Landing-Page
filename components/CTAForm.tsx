"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { validateField, validateLead } from "@/lib/validation";
import type { LeadData, LeadErrors, LeadField } from "@/lib/validation";

const flodeskFormId = "6ae708aee178d975eb35d0ac";

const flodeskFieldIds: Record<LeadField, string> = {
  fullName: "firstName",
  email: "email",
  whatsapp: "cOweKA8tCR",
  businessName: "7Z8bWaojpg",
  website: "YjkrKLUYYf",
  message: "NHe4lgTkNx",
};

type FlodeskFunction = ((command: string, options?: Record<string, unknown>) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    FlodeskObject?: string;
    fd?: FlodeskFunction;
  }
}

const initialData: LeadData = {
  fullName: "",
  email: "",
  whatsapp: "",
  businessName: "",
  website: "",
  message: "",
};

const highlights = ["One-to-One Consultation", "Customized Strategy for Your Business", "Free 1-Hour Call"];

type FieldConfig = {
  name: LeadField;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
};

const fields: FieldConfig[] = [
  { name: "fullName", label: "Full Name", placeholder: "Your full name", required: true, autoComplete: "name" },
  { name: "email", label: "Active Email", placeholder: "you@example.com", type: "email", required: true, autoComplete: "email" },
  { name: "whatsapp", label: "WhatsApp Number", placeholder: "+977 98XXXXXXXX", type: "tel", required: true, autoComplete: "tel" },
  { name: "businessName", label: "Business Name", placeholder: "Your business name", required: true, autoComplete: "organization" },
  { name: "website", label: "Website or Facebook URL", placeholder: "yourbusiness.com or facebook.com/yourpage", type: "url", required: true },
];

export function CTAForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const runtimeRef = useRef<HTMLDivElement>(null);
  const flodeskInitStartedRef = useRef(false);
  const submissionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [isFlodeskReady, setIsFlodeskReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (flodeskInitStartedRef.current) return;
    flodeskInitStartedRef.current = true;

    window.FlodeskObject = "fd";
    if (!window.fd) {
      const fd: FlodeskFunction = (command: string, options?: Record<string, unknown>) => {
        fd.q = fd.q ?? [];
        fd.q.push([command, options]);
      };
      window.fd = fd;
    }

    const runtime = runtimeRef.current;
    const getRuntimeRoot = () => runtime?.querySelector<HTMLElement>('[data-ff-el="root"]') ?? null;
    const markReady = () => {
      if (getRuntimeRoot()?.dataset.ffHandleStatus === "initialized") {
        setIsFlodeskReady(true);
        setSubmitError("");
      }
    };
    const positionCaptcha = () => {
      const form = formRef.current;
      const footer = form?.querySelector<HTMLElement>("[data-visible-footer]");
      const submit = form?.querySelector<HTMLButtonElement>("[data-visible-submit]");
      if (!runtime || !footer || !submit) return;

      const captcha = Array.from(runtime.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')).find((checkbox) => {
        const labelText = Array.from(checkbox.labels ?? []).map((label) => label.textContent ?? "").join(" ");
        return /not a robot/i.test(`${labelText} ${checkbox.parentElement?.textContent ?? ""}`);
      });
      if (!captcha) return;

      const runtimeForm = captcha.closest("form");
      if (runtimeForm) {
        runtimeForm.id = `fd-runtime-form-${flodeskFormId}`;
        captcha.setAttribute("form", runtimeForm.id);
      }
      const captchaContainer = captcha.closest<HTMLElement>("label") ?? captcha.parentElement ?? captcha;
      if (!captchaContainer.classList.contains("flodesk-captcha")) {
        captchaContainer.classList.add("flodesk-captcha");
      }
      if (captchaContainer.parentElement !== footer || captchaContainer.nextElementSibling !== submit) {
        footer.insertBefore(captchaContainer, submit);
      }
      if (submit.textContent !== "Complete verification above") {
        submit.textContent = "Complete verification above";
      }
      if (submissionTimeoutRef.current) clearTimeout(submissionTimeoutRef.current);
    };
    window.addEventListener("formHandled", markReady);

    window.fd("form", {
      formId: flodeskFormId,
      containerEl: `#fd-runtime-${flodeskFormId}`,
    });

    if (!document.querySelector('script[data-flodesk-universal="module"]')) {
      const cacheVersion = Math.floor(Date.now() / 120000) * 60;
      const moduleScript = document.createElement("script");
      moduleScript.async = true;
      moduleScript.type = "module";
      moduleScript.src = `https://assets.flodesk.com/universal.mjs?v=${cacheVersion}`;
      moduleScript.dataset.flodeskUniversal = "module";
      moduleScript.addEventListener("error", () => {
        setSubmitError("The booking form could not connect to Flodesk. Please refresh and try again.");
      });
      document.head.appendChild(moduleScript);

      const legacyScript = document.createElement("script");
      legacyScript.async = true;
      legacyScript.noModule = true;
      legacyScript.src = `https://assets.flodesk.com/universal.js?v=${cacheVersion}`;
      legacyScript.dataset.flodeskUniversal = "legacy";
      document.head.appendChild(legacyScript);
    }

    const observer = runtime
      ? new MutationObserver(() => {
          markReady();
          positionCaptcha();
          const stage = getRuntimeRoot()?.dataset.ffStage;
          if (stage === "success") {
            if (submissionTimeoutRef.current) clearTimeout(submissionTimeoutRef.current);
            router.push("/thank-you");
          } else if (stage === "error") {
            if (submissionTimeoutRef.current) clearTimeout(submissionTimeoutRef.current);
            setIsSubmitting(false);
            setSubmitError("Flodesk could not save your information. Please check the fields and try again.");
          }
        })
      : null;
    observer?.observe(runtime!, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    markReady();
    positionCaptcha();

    return () => {
      window.removeEventListener("formHandled", markReady);
      observer?.disconnect();
      if (submissionTimeoutRef.current) clearTimeout(submissionTimeoutRef.current);
    };
  }, [router]);

  function updateField(field: LeadField, value: string) {
    setData((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: validateField(field, value) }));
    }
  }

  function handleBlur(field: LeadField) {
    setErrors((current) => ({ ...current, [field]: validateField(field, data[field]) }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!isFlodeskReady) {
      setSubmitError("The secure form is still loading. Please wait a moment and try again.");
      return;
    }

    const nextErrors = validateLead(data);
    setErrors(nextErrors);
    setSubmitError("");
    const firstInvalid = (Object.keys(data) as LeadField[]).find((field) => nextErrors[field]);

    if (firstInvalid) {
      const element = formRef.current?.querySelector(`[data-lead-field="${firstInvalid}"]`);
      if (element instanceof HTMLElement) element.focus();
      return;
    }

    const runtimeForm = runtimeRef.current?.querySelector<HTMLFormElement>('form[data-ff-el="form"]');
    if (!runtimeForm) {
      setSubmitError("The secure form did not finish loading. Please refresh and try again.");
      setIsFlodeskReady(false);
      return;
    }

    try {
      for (const field of Object.keys(flodeskFieldIds) as LeadField[]) {
        const control = runtimeRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
          `#ff-${flodeskFormId}-${flodeskFieldIds[field]}`,
        );
        if (!control) throw new Error(`Missing Flodesk field: ${field}`);
        control.value = data[field];
        control.dispatchEvent(new Event("input", { bubbles: true }));
        control.dispatchEvent(new Event("change", { bubbles: true }));
      }

      setIsSubmitting(true);
      submissionTimeoutRef.current = setTimeout(() => {
        setIsSubmitting(false);
        setSubmitError("Flodesk did not confirm the submission. Please check your connection and try again.");
      }, 25000);
      runtimeForm.requestSubmit();
    } catch {
      setIsSubmitting(false);
      setSubmitError("The secure form could not prepare your information. Please refresh and try again.");
    }
  }

  return (
    <section
      id="book"
      className="scroll-mt-4 bg-page py-16 sm:py-24"
      aria-labelledby="book-heading"
    >
      <div className="section-shell grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-8">
          <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-dark-teal">Your next step</span>
          <h2 id="book-heading" className="mt-3 text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">Book the Call</h2>
          <ul className="mt-7 space-y-3">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3 font-semibold leading-7 text-ink">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-light-teal text-xs font-black text-dark-teal" aria-hidden="true">✓</span>
                {highlight}
              </li>
            ))}
          </ul>
          <p className="mt-7 max-w-md leading-7 text-muted-ink">Fill in the form below. I&apos;ll contact you on WhatsApp to confirm your call.</p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="rounded-[2rem] border border-brand-border bg-white p-5 shadow-[0_22px_60px_rgb(6_43_80/9%)] sm:p-8"
        >
          <div>
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => {
              const error = errors[field.name];
              const errorId = `${field.name}-error`;
              return (
                <div key={field.name} className={field.name === "website" ? "sm:col-span-2" : ""}>
                  <label htmlFor={`lead-${field.name}`} className="mb-2 block text-sm font-bold text-navy">
                    {field.label}
                    {field.required ? <span className="ml-1 text-error" aria-hidden="true">*</span> : <span className="ml-1 font-normal text-muted-ink">(optional)</span>}
                  </label>
                  <input
                    id={`lead-${field.name}`}
                    type={field.type ?? "text"}
                    required={field.required}
                    autoComplete={field.autoComplete}
                    value={data[field.name]}
                    onChange={(event) => updateField(field.name, event.target.value)}
                    onBlur={() => handleBlur(field.name)}
                    placeholder={field.placeholder}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    data-lead-field={field.name}
                    className="min-h-12 w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-base text-ink placeholder:text-slate-400 hover:border-teal/60 aria-invalid:border-error"
                  />
                  {error ? <p id={errorId} className="mt-2 text-sm font-semibold text-error">{error}</p> : null}
                </div>
              );
            })}

            <div className="sm:col-span-2">
              <label htmlFor="lead-message" className="mb-2 block text-sm font-bold text-navy">
                Anything You Want to Say <span className="ml-1 font-normal text-muted-ink">(optional)</span>
              </label>
              <textarea
                id="lead-message"
                rows={5}
                value={data.message}
                onChange={(event) => updateField("message", event.target.value)}
                onBlur={() => handleBlur("message")}
                placeholder="Share anything that will help me understand your business."
                data-lead-field="message"
                className="min-h-32 w-full resize-y rounded-xl border border-brand-border bg-white px-4 py-3 text-base text-ink placeholder:text-slate-400 hover:border-teal/60"
              />
            </div>
          </div>

          <div data-visible-footer>
            {submitError ? <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-error">{submitError}</p> : null}
            <button type="submit" disabled={!isFlodeskReady || isSubmitting} className="primary-cta mt-6 w-full" aria-live="polite" data-visible-submit>
              {!isFlodeskReady ? "Loading secure form…" : isSubmitting ? "Submitting…" : "Book Free Consultation"}
            </button>
            <p className="mt-4 text-center text-sm text-muted-ink">We respect your privacy. No spam.</p>
          </div>
          </div>

        </form>
      </div>
      <div ref={runtimeRef} id={`fd-runtime-${flodeskFormId}`} className="flodesk-runtime" aria-hidden="true" />
    </section>
  );
}
