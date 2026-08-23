"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login?mode=register");
  }, [router]);

  return (
    <div className="h-40 flex items-center justify-center text-gray-400">
      Redirecting to unified authentication...
    </div>
  );
}
