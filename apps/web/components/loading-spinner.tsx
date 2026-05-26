import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Loader2 className="animate-spin text-[#5865f2]" size={28} />
    </div>
  );
}
