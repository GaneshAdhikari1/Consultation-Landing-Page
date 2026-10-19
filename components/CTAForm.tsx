"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { submitLead } from "@/lib/submitLead";
import { validateField, validateLead } from "@/lib/validation";
import type { LeadData, LeadErrors, LeadField } from "@/lib/validation";

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
  { name: "website", label: "Website or Facebook URL", placeholder: "yourbusiness.com or facebook.com/yourpage", type: "url" },
];

export function CTAForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function updateField(field: LeadField, value: string) {
    setData((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: validateField(field, value) }));
    }
  }

  function handleBlur(field: LeadField) {
    setErrors((current) => ({ ...current, [field]: validateField(field, data[field]) }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validateLead(data);
    setErrors(nextErrors);
    setSubmitError("");
    const firstInvalid = (Object.keys(data) as LeadField[]).find((field) => nextErrors[field]);

    if (firstInvalid) {
      const element = formRef.current?.elements.namedItem(firstInvalid);
      if (element instanceof HTMLElement) element.focus();
      return;
    }

    try {
      setIsSubmitting(true);
      await submitLead(data);
      router.push("/thank-you");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <section id="book" className="scroll-mt-4 bg-page py-16 sm:py-24" aria-labelledby="book-heading">
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

        <form ref={formRef} onSubmit={handleSubmit} noValidate className="rounded-[2rem] border border-brand-border bg-white p-5 shadow-[0_22px_60px_rgb(6_43_80/9%)] sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => {
              const error = errors[field.name];
              const errorId = `${field.name}-error`;
              return (
                <div key={field.name} className={field.name === "website" ? "sm:col-span-2" : ""}>
                  <label htmlFor={field.name} className="mb-2 block text-sm font-bold text-navy">
                    {field.label}
                    {field.required ? <span className="ml-1 text-error" aria-hidden="true">*</span> : <span className="ml-1 font-normal text-muted-ink">(optional)</span>}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type ?? "text"}
                    required={field.required}
                    autoComplete={field.autoComplete}
                    value={data[field.name]}
                    onChange={(event) => updateField(field.name, event.target.value)}
                    onBlur={() => handleBlur(field.name)}
                    placeholder={field.placeholder}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    className="min-h-12 w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-base text-ink placeholder:text-slate-400 hover:border-teal/60 aria-invalid:border-error"
                  />
                  {error ? <p id={errorId} className="mt-2 text-sm font-semibold text-error">{error}</p> : null}
                </div>
              );
            })}

            <div className="sm:col-span-2">
              <label htmlFor="message" className="mb-2 block text-sm font-bold text-navy">
                Anything You Want to Say <span className="ml-1 font-normal text-muted-ink">(optional)</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={data.message}
                onChange={(event) => updateField("message", event.target.value)}
                onBlur={() => handleBlur("message")}
                placeholder="Share anything that will help me understand your business."
                className="min-h-32 w-full resize-y rounded-xl border border-brand-border bg-white px-4 py-3 text-base text-ink placeholder:text-slate-400 hover:border-teal/60"
              />
            </div>
          </div>

          {submitError ? <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-error">{submitError}</p> : null}
          <button type="submit" disabled={isSubmitting} className="primary-cta mt-6 w-full" aria-live="polite">
            {isSubmitting ? "Submitting…" : "Book Free Consultation"}
          </button>
          <p className="mt-4 text-center text-sm text-muted-ink">We respect your privacy. No spam.</p>
        </form>
      </div>
    </section>
  );
}
