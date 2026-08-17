"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/account/orders");
  }, [router]);
  return (
    <div className="container-site py-16 text-[var(--muted)]">Loading order history...</div>
  );
}
