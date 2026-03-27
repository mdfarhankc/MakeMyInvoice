"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getInvoice } from "@/lib/invoice-store";
import { InvoicePreview } from "@/components/invoice-preview";
import type { Invoice } from "@/lib/types";

export default function ViewInvoicePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const inv = getInvoice(params.id);
    if (!inv) {
      router.push("/invoices");
      return;
    }
    setInvoice(inv);
    setLoaded(true);
  }, [params.id, router]);

  if (!loaded || !invoice) return null;

  function handleUpdate(updated: Invoice) {
    setInvoice(updated);
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6 md:py-10">
      <InvoicePreview invoice={invoice} onUpdate={handleUpdate} />
    </div>
  );
}
