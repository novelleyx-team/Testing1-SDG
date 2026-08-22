import { Settings } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="relative">
        <Settings className="w-16 h-16 text-[#2563EB] animate-spin" style={{ animationDuration: '3s' }} />
        <Settings className="w-8 h-8 text-blue-300 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
      </div>
      <p className="mt-6 text-gray-500 font-medium animate-pulse text-sm">Processing...</p>
    </div>
  );
}
