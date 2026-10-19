import type { LeadData } from "./validation";

export async function submitLead(_data: LeadData): Promise<void> {
  // TODO: Replace this simulation with a real backend, email service, Google Sheets integration, or CRM before running paid ads.
  await new Promise((resolve) => setTimeout(resolve, 850));
}
