"use client";

import dynamic from "next/dynamic";

const FormBuilder = dynamic(() => import("~/components/form-builder").then(m => ({ default: m.FormBuilder })), { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[#5865f2] border-t-transparent rounded-full" /></div> });

export default function BuilderPage() {
  return <FormBuilder />;
}
