"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getInvoice } from "@/lib/invoice-store";
import { InvoiceForm } from "@/components/invoice-form";
import type { Invoice } from "@/lib/types";

export default function EditInvoicePage() {
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

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6 md:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Invoice</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">{invoice.number}</p>
      </div>
      <InvoiceForm invoice={invoice} />
    </div>
  );
}
