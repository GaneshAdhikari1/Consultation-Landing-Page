export type LeadData = {
  fullName: string;
  email: string;
  whatsapp: string;
  businessName: string;
  website: string;
  message: string;
};

export type LeadField = keyof LeadData;
export type LeadErrors = Partial<Record<LeadField, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[\d\s+-]+$/;

function resemblesUrl(value: string) {
  try {
    const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const url = new URL(candidate);
    return url.hostname.includes(".") && !url.hostname.startsWith(".") && !url.hostname.endsWith(".");
  } catch {
    return false;
  }
}

export function validateField(field: LeadField, value: string): string | undefined {
  const trimmed = value.trim();

  if (["fullName", "email", "whatsapp", "businessName"].includes(field) && !trimmed) {
    return "This field is required.";
  }
  if (field === "email" && trimmed && !emailPattern.test(trimmed)) {
    return "Enter a valid email address.";
  }
  if (field === "whatsapp" && trimmed) {
    if (!phonePattern.test(trimmed)) return "Use only digits, spaces, +, and -.";
    if (trimmed.replace(/\D/g, "").length < 10) return "Enter at least 10 digits.";
  }
  if (field === "website" && trimmed && !resemblesUrl(trimmed)) {
    return "Enter a valid website or Facebook URL.";
  }
  return undefined;
}

export function validateLead(data: LeadData): LeadErrors {
  return (Object.keys(data) as LeadField[]).reduce<LeadErrors>((errors, field) => {
    const error = validateField(field, data[field]);
    if (error) errors[field] = error;
    return errors;
  }, {});
}
