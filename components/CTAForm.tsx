"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { validateField, validateLead } from "@/lib/validation";
import type { LeadData, LeadErrors, LeadField } from "@/lib/validation";

const flodeskFormId = "6ae708aee178d975eb35d0ac";
const flodeskRootSelector = `.ff-${flodeskFormId}`;
const flodeskSubmitUrl = `https://form.flodesk.com/forms/${flodeskFormId}/submit`;
const flodeskConfig = "eyJ0cmlnZ2VyIjp7Im1vZGUiOiJpbW1lZGlhdGVseSIsInZhbHVlIjowfSwib25TdWNjZXNzIjp7Im1vZGUiOiJyZWRpcmVjdCIsIm1lc3NhZ2UiOiIiLCJyZWRpcmVjdFVybCI6Imh0dHBzOi8vY29uc3VsdGF0aW9uLmdhbmVzaGFkaGlrYXJpMS5jb20ubnAvdGhhbmsteW91In0sImNvaSI6dHJ1ZSwic2hvd0ZvclJldHVyblZpc2l0b3JzIjp0cnVlLCJub3RpZmljYXRpb24iOnRydWUsImdkcHIiOnsiYWNjZXB0c01hcmtldGluZyI6ZmFsc2UsInByaXZhY3lQb2xpY3kiOnsiZW5hYmxlZCI6ZmFsc2UsIm1hbmRhdG9yeSI6ZmFsc2V9fSwidHJhY2tpbmdDb25maWciOnsibWV0YVBpeGVsSWQiOiIiLCJjb29raWVCYW5uZXJFbmFibGVkIjpmYWxzZSwiZ29vZ2xlQW5hbHl0aWNzSWQiOiIifX0=";

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
  flodeskId: string;
  flodeskName?: string;
  flodeskTab: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
};

const fields: FieldConfig[] = [
  { name: "fullName", flodeskId: "firstName", flodeskName: "firstName", flodeskTab: "firstName::email", label: "Full Name", placeholder: "Your full name", required: true, autoComplete: "name" },
  { name: "email", flodeskId: "email", flodeskName: "email", flodeskTab: "email:firstName:fields.whatsAppNumber", label: "Active Email", placeholder: "you@example.com", type: "email", required: true, autoComplete: "email" },
  { name: "whatsapp", flodeskId: "cOweKA8tCR", flodeskName: "fields.whatsAppNumber", flodeskTab: "fields.whatsAppNumber:email:fields.businessName", label: "WhatsApp Number", placeholder: "+977 98XXXXXXXX", type: "tel", required: true, autoComplete: "tel" },
  { name: "businessName", flodeskId: "7Z8bWaojpg", flodeskName: "fields.businessName", flodeskTab: "fields.businessName:fields.whatsAppNumber:fields.websiteOrFacebookUrl", label: "Business Name", placeholder: "Your business name", required: true, autoComplete: "organization" },
  { name: "website", flodeskId: "YjkrKLUYYf", flodeskName: "fields.websiteOrFacebookUrl", flodeskTab: "fields.websiteOrFacebookUrl:fields.businessName:fields.anythingYouWantToSay", label: "Website or Facebook URL", placeholder: "yourbusiness.com or facebook.com/yourpage", type: "url", required: true },
];

export function CTAForm() {
  const router = useRouter();
  const rootRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
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

    const root = rootRef.current;
    const markReady = () => {
      if (root?.dataset.ffHandleStatus === "initialized") {
        setIsFlodeskReady(true);
        setSubmitError("");
      }
    };
    const positionCaptcha = () => {
      const form = formRef.current;
      const footer = form?.querySelector<HTMLElement>('[data-ff-el="footer"]');
      const submit = form?.querySelector<HTMLButtonElement>('[data-ff-el="submit"]');
      if (!form || !footer || !submit) return;

      const captcha = Array.from(form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')).find((checkbox) => {
        const labelText = Array.from(checkbox.labels ?? []).map((label) => label.textContent ?? "").join(" ");
        return /not a robot/i.test(`${labelText} ${checkbox.parentElement?.textContent ?? ""}`);
      });
      if (!captcha) return;

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

    window.fd("form:handle", {
      formId: flodeskFormId,
      rootEl: flodeskRootSelector,
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

    const observer = root
      ? new MutationObserver(() => {
          markReady();
          positionCaptcha();
          const stage = root.dataset.ffStage;
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
    observer?.observe(root!, {
      attributes: true,
      attributeFilter: ["data-ff-stage", "data-ff-handle-status"],
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
    if (isSubmitting) {
      event.preventDefault();
      return;
    }

    if (!isFlodeskReady) {
      event.preventDefault();
      setSubmitError("The secure form is still loading. Please wait a moment and try again.");
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

    setIsSubmitting(true);
    submissionTimeoutRef.current = setTimeout(() => {
      setIsSubmitting(false);
      setSubmitError("Flodesk did not confirm the submission. Please check your connection and try again.");
    }, 20000);
  }

  return (
    <section
      ref={rootRef}
      id="book"
      className={`ff-${flodeskFormId} scroll-mt-4 bg-page py-16 sm:py-24`}
      aria-labelledby="book-heading"
      data-ff-el="root"
      data-ff-version="3"
      data-ff-type="inline"
      data-ff-name="inlineNoImage"
      data-ff-stage="default"
    >
      <div data-ff-el="config" data-ff-config={flodeskConfig} hidden />
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
          onSubmit={handleSubmit}
          noValidate
          data-ff-el="form"
          className={`ff-${flodeskFormId}__form rounded-[2rem] border border-brand-border bg-white p-5 shadow-[0_22px_60px_rgb(6_43_80/9%)] sm:p-8`}
        >
          <div className={`ff-${flodeskFormId}__content fd-form-content`} data-ff-el="content">
          <div className={`ff-${flodeskFormId}__fields grid gap-5 sm:grid-cols-2`} data-ff-el="fields">
            {fields.map((field) => {
              const error = errors[field.name];
              const errorId = `${field.name}-error`;
              return (
                <div key={field.name} className={`ff-${flodeskFormId}__field fd-form-group ${field.name === "website" ? "sm:col-span-2" : ""}`}>
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
                    className={`ff-${flodeskFormId}__control fd-form-control min-h-12 w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-base text-ink placeholder:text-slate-400 hover:border-teal/60 aria-invalid:border-error`}
                  />
                  {error ? <p id={errorId} className="mt-2 text-sm font-semibold text-error">{error}</p> : null}
                </div>
              );
            })}

            <div className={`ff-${flodeskFormId}__field fd-form-group sm:col-span-2`}>
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
                className={`ff-${flodeskFormId}__control fd-form-control min-h-32 w-full resize-y rounded-xl border border-brand-border bg-white px-4 py-3 text-base text-ink placeholder:text-slate-400 hover:border-teal/60`}
              />
            </div>
          </div>

          <input type="text" name="confirm_email_address" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          <div className={`ff-${flodeskFormId}__footer`} data-ff-el="footer">
            {submitError ? <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-error">{submitError}</p> : null}
            <button type="submit" disabled={!isFlodeskReady || isSubmitting} className={`ff-${flodeskFormId}__button fd-btn primary-cta mt-6 w-full`} aria-live="polite" data-ff-el="submit" data-ff-tab="submit">
              {!isFlodeskReady ? "Loading secure form…" : isSubmitting ? "Submitting…" : "Book Free Consultation"}
            </button>
            <p className="mt-4 text-center text-sm text-muted-ink">We respect your privacy. No spam.</p>
          </div>
          </div>

          <div data-ff-el="success" className={`ff-${flodeskFormId}__success fd-form-success hidden`} aria-hidden="true" />
          <div data-ff-el="error" className={`ff-${flodeskFormId}__error fd-form-error`} aria-live="polite" />
        </form>
      </div>
    </section>
  );
}
