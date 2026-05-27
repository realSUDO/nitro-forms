"use client";

import { useEffect } from "react";

export default function DocsPage() {
  useEffect(() => {
    window.location.href = window.location.origin.replace(":3000", ":5001") + "/docs";
  }, []);
  return <div className="min-h-screen bg-[#313338] flex items-center justify-center text-[#949ba4] text-sm">Redirecting to API docs...</div>;
}
