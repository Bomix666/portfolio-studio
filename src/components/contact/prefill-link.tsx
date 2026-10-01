"use client";

import type { ComponentProps } from "react";
import type { ProjectTypeValue } from "@/config/contact";
import { SmartLink } from "@/components/ui/smart-link";
import { requestContactPrefill } from "@/lib/contact-prefill";

/** Link to the contact form that pre-selects a project type on the way. */
export function PrefillLink({
  projectType,
  ...props
}: ComponentProps<typeof SmartLink> & { projectType: ProjectTypeValue }) {
  return <SmartLink {...props} onClick={() => requestContactPrefill({ projectType })} />;
}
