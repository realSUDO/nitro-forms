"use client";

import { trpc } from "~/trpc/client";

export function useMyForms() {
  return trpc.form.listMine.useQuery();
}

export function useExploreForms() {
  return trpc.public.listExploreForms.useQuery();
}

export function useFormBySlug(slug: string) {
  return trpc.public.getFormBySlug.useQuery({ slug }, { enabled: !!slug });
}
