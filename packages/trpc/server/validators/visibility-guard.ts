interface FormForGuard {
  status: string;
  visibility: string;
  expiresAt: Date | null;
  responseLimit: number | null;
}

type GuardResult = { allowed: true } | { allowed: false; reason: string };

export function canAcceptSubmission(form: FormForGuard, currentResponseCount: number): GuardResult {
  if (form.status !== "published") {
    return { allowed: false, reason: form.status === "archived" ? "Form is archived" : "Form is not published" };
  }
  if (form.expiresAt && new Date() > form.expiresAt) {
    return { allowed: false, reason: "Form has expired" };
  }
  if (form.responseLimit && currentResponseCount >= form.responseLimit) {
    return { allowed: false, reason: "Response limit reached" };
  }
  return { allowed: true };
}

export function canShowInExplore(form: FormForGuard): boolean {
  return form.status === "published" && form.visibility === "public";
}
