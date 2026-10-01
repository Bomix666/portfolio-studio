import type { ProjectTypeValue } from "@/config/contact";

/** Lets any section pre-select contact form fields (e.g. "Discuss a website project"). */
export const PREFILL_EVENT = "contact:prefill";

export interface ContactPrefill {
  projectType?: ProjectTypeValue;
}

export function requestContactPrefill(prefill: ContactPrefill) {
  window.dispatchEvent(new CustomEvent<ContactPrefill>(PREFILL_EVENT, { detail: prefill }));
}
