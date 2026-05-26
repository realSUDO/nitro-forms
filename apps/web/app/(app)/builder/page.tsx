"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "~/trpc/client";
import { LoadingSpinner } from "~/components/loading-spinner";

export default function BuilderIndex() {
  const router = useRouter();
  const createForm = trpc.form.create.useMutation({
    onSuccess: (form) => {
      router.replace(`/builder/${form!.id}`);
    },
    onError: () => {
      router.replace("/dashboard");
    },
  });

  useEffect(() => {
    createForm.mutate({ title: "Untitled Form" });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <LoadingSpinner />;
}
