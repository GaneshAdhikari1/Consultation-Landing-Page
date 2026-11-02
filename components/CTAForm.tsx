"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { validateField, validateLead } from "@/lib/validation";
import type { LeadData, LeadErrors, LeadField } from "@/lib/validation";

const flodeskFormId = "6ae708aee178d975eb35d0ac";
const flodeskSubmitUrl = `https://form.flodesk.com/forms/${flodeskFormId}/submit`;
const flodeskFrameName = "flodesk-consultation-submit";

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
  flodeskId: string;
  flodeskName: string;
  flodeskTab: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
};

const fields: FieldConfig[] = [
  { name: "fullName", flodeskId: "firstName", flodeskName: "firstName", flodeskTab: "firstName::email", label: "Full Name", placeholder: "Your full name", required: true, autoComplete: "name" },
  { name: "email", flodeskId: "email", flodeskName: "email", flodeskTab: "email:firstName:fields.", label: "Active Email", placeholder: "you@example.com", type: "email", required: true, autoComplete: "email" },
  { name: "whatsapp", flodeskId: "cOweKA8tCR", flodeskName: "fields.", flodeskTab: "fields.:email:fields.", label: "WhatsApp Number", placeholder: "+977 98XXXXXXXX", type: "tel", required: true, autoComplete: "tel" },
  { name: "businessName", flodeskId: "7Z8bWaojpg", flodeskName: "fields.", flodeskTab: "fields.:email:fields.", label: "Business Name", placeholder: "Your business name", required: true, autoComplete: "organization" },
  { name: "website", flodeskId: "YjkrKLUYYf", flodeskName: "fields.websiteOrFacebookUrl", flodeskTab: "fields.websiteOrFacebookUrl:fields.:fields.anythingYouWantToSay", label: "Website or Facebook URL", placeholder: "yourbusiness.com or facebook.com/yourpage", type: "url" },
];

export function CTAForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const submissionStartedRef = useRef(false);
  const submissionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    return () => {
      if (submissionTimeoutRef.current) clearTimeout(submissionTimeoutRef.current);
    };
  }, []);

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
    if (isSubmitting) {
      event.preventDefault();
      return;
    }

    const nextErrors = validateLead(data);
    setErrors(nextErrors);
    setSubmitError("");
    const firstInvalid = (Object.keys(data) as LeadField[]).find((field) => nextErrors[field]);

    if (firstInvalid) {
      event.preventDefault();
      const element = formRef.current?.querySelector(`[data-lead-field="${firstInvalid}"]`);
      if (element instanceof HTMLElement) element.focus();
      return;
    }

    submissionStartedRef.current = true;
    setIsSubmitting(true);
    submissionTimeoutRef.current = setTimeout(() => {
      submissionStartedRef.current = false;
      setIsSubmitting(false);
      setSubmitError("The submission timed out. Please check your connection and try again.");
    }, 20000);
  }

  function handleFlodeskLoad() {
    if (!submissionStartedRef.current) return;
    submissionStartedRef.current = false;
    if (submissionTimeoutRef.current) clearTimeout(submissionTimeoutRef.current);
    router.push("/thank-you");
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
          action={flodeskSubmitUrl}
          method="post"
          target={flodeskFrameName}
          onSubmit={handleSubmit}
          noValidate
          data-ff-el="form"
          className="rounded-[2rem] border border-brand-border bg-white p-5 shadow-[0_22px_60px_rgb(6_43_80/9%)] sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2" data-ff-el="content">
            {fields.map((field) => {
              const error = errors[field.name];
              const errorId = `${field.name}-error`;
              return (
                <div key={field.name} className={field.name === "website" ? "sm:col-span-2" : ""}>
                  <label htmlFor={`ff-${flodeskFormId}-${field.flodeskId}`} className="mb-2 block text-sm font-bold text-navy">
                    {field.label}
                    {field.required ? <span className="ml-1 text-error" aria-hidden="true">*</span> : <span className="ml-1 font-normal text-muted-ink">(optional)</span>}
                  </label>
                  <input
                    id={`ff-${flodeskFormId}-${field.flodeskId}`}
                    name={field.flodeskName}
                    type={field.type ?? "text"}
                    required={field.required}
                    autoComplete={field.autoComplete}
                    value={data[field.name]}
                    onChange={(event) => updateField(field.name, event.target.value)}
                    onBlur={() => handleBlur(field.name)}
                    placeholder={field.placeholder}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    data-ff-tab={field.flodeskTab}
                    data-lead-field={field.name}
                    className="min-h-12 w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-base text-ink placeholder:text-slate-400 hover:border-teal/60 aria-invalid:border-error"
                  />
                  {error ? <p id={errorId} className="mt-2 text-sm font-semibold text-error">{error}</p> : null}
                </div>
              );
            })}

            <div className="sm:col-span-2">
              <label htmlFor={`ff-${flodeskFormId}-NHe4lgTkNx`} className="mb-2 block text-sm font-bold text-navy">
                Anything You Want to Say <span className="ml-1 font-normal text-muted-ink">(optional)</span>
              </label>
              <textarea
                id={`ff-${flodeskFormId}-NHe4lgTkNx`}
                name="fields.anythingYouWantToSay"
                rows={5}
                value={data.message}
                onChange={(event) => updateField("message", event.target.value)}
                onBlur={() => handleBlur("message")}
                placeholder="Share anything that will help me understand your business."
                data-ff-tab="fields.anythingYouWantToSay:fields.websiteOrFacebookUrl:submit"
                data-lead-field="message"
                className="min-h-32 w-full resize-y rounded-xl border border-brand-border bg-white px-4 py-3 text-base text-ink placeholder:text-slate-400 hover:border-teal/60"
              />
            </div>
          </div>

          <input type="text" name="confirm_email_address" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          {submitError ? <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-error">{submitError}</p> : null}
          <button type="submit" disabled={isSubmitting} className="primary-cta mt-6 w-full" aria-live="polite" data-ff-el="submit" data-ff-tab="submit">
            {isSubmitting ? "Submitting…" : "Book Free Consultation"}
          </button>
          <p className="mt-4 text-center text-sm text-muted-ink">We respect your privacy. No spam.</p>
          <div data-ff-el="success" className="hidden" aria-hidden="true" />
          <div data-ff-el="error" className="hidden" aria-hidden="true" />
        </form>
        <iframe
          name={flodeskFrameName}
          title="Flodesk form submission"
          className="hidden"
          onLoad={handleFlodeskLoad}
        />
      </div>
    </section>
  );
}
