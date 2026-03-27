"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Bookmark, Copy, Download, Loader2, MoreHorizontal, Pencil, Trash2, CheckCircle2, RotateCcw, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  type Invoice,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  generateId,
  generateInvoiceNumber,
} from "@/lib/types";
import { deleteInvoice, saveInvoice, saveTemplate, type InvoiceTemplate } from "@/lib/invoice-store";
import { generatePdf } from "@/lib/generate-pdf";
import { useCurrency } from "@/lib/currency-context";
import { currencies, formatAmount, type Currency } from "@/lib/currency";
import { cn } from "@/lib/utils";

const statusColors: Record<Invoice["status"], string> = {
  draft: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  sent: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  paid: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

interface InvoicePreviewProps {
  invoice: Invoice;
  onUpdate?: (invoice: Invoice) => void;
}

export function InvoicePreview({ invoice, onUpdate }: InvoicePreviewProps) {
  const router = useRouter();
  const { currency: globalCurrency } = useCurrency();
  const [downloading, setDownloading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const invoiceCurrency: Currency = invoice.currency
    ? (currencies.find((c) => c.code === invoice.currency) ?? globalCurrency)
    : globalCurrency;

  const subtotal = calculateSubtotal(invoice.items);
  const tax = calculateTax(invoice.items, invoice.taxRate);
  const total = calculateTotal(invoice.items, invoice.taxRate);
  const fmt = (n: number) => formatAmount(n, invoiceCurrency);
  const isOverdue = invoice.status !== "paid" && new Date(invoice.dueDate) < new Date(new Date().toISOString().split("T")[0]);

  function handleStatusChange(status: Invoice["status"]) {
    const updated = { ...invoice, status };
    saveInvoice(updated);
    onUpdate?.(updated);
    const msg = status === "sent" ? "Marked as sent" : status === "paid" ? "Marked as paid" : "Reset to draft";
    toast.success(msg, { description: invoice.number });
  }

  function handleDuplicate() {
    const duplicate: Invoice = {
      ...invoice,
      id: generateId(),
      number: generateInvoiceNumber(),
      createdAt: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      status: "draft",
      items: invoice.items.map((item) => ({ ...item, id: generateId() })),
    };
    saveInvoice(duplicate);
    toast.success("Invoice duplicated", { description: duplicate.number });
    router.push(`/invoices/${duplicate.id}`);
  }

  function handleSaveTemplate() {
    const name = prompt("Template name:", `${invoice.toName} template`);
    if (!name) return;
    const template: InvoiceTemplate = {
      id: generateId(),
      name,
      fromName: invoice.fromName,
      fromEmail: invoice.fromEmail,
      fromAddress: invoice.fromAddress,
      toName: invoice.toName,
      toEmail: invoice.toEmail,
      toAddress: invoice.toAddress,
      items: invoice.items.map((item) => ({ ...item, id: generateId() })),
      taxRate: invoice.taxRate,
      notes: invoice.notes,
      currency: invoice.currency,
    };
    saveTemplate(template);
    toast.success("Saved as template", { description: name });
  }

  function handleDelete() {
    // Soft delete: remove from store, navigate away, show undo toast
    deleteInvoice(invoice.id);
    router.push("/invoices");
    toast("Invoice deleted", {
      description: invoice.number,
      action: {
        label: "Undo",
        onClick: () => {
          saveInvoice(invoice);
          toast.success("Invoice restored", { description: invoice.number });
        },
      },
      duration: 6000,
    });
  }

  async function handleDownloadPdf() {
    setDownloading(true);
    try {
      await generatePdf("invoice-document", `${invoice.number}.pdf`);
      toast.success("PDF downloaded", { description: `${invoice.number}.pdf` });
    } catch {
      toast.error("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div>
      {/* Action bar */}
      <div className="mb-8 flex items-center gap-2 print:hidden">
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => router.push("/invoices")}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex-1" />

        {/* Status actions */}
        {invoice.status === "draft" && (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleStatusChange("sent")}>
            <Send className="h-3.5 w-3.5" />
            Mark Sent
          </Button>
        )}
        {invoice.status === "sent" && (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleStatusChange("paid")}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Mark Paid
          </Button>
        )}
        {invoice.status !== "draft" && (
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => handleStatusChange("draft")}>
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Primary actions */}
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => router.push(`/invoices/${invoice.id}/edit`)}>
          <Pencil className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleDownloadPdf} disabled={downloading}>
          {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">PDF</span>
        </Button>

        {/* More dropdown */}
        <div className="relative">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMenuOpen(!menuOpen)}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border bg-popover p-1 shadow-lg">
                <button onClick={() => { handleDuplicate(); setMenuOpen(false); }} className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm hover:bg-accent">
                  <Copy className="h-3.5 w-3.5" /> Duplicate
                </button>
                <button onClick={() => { handleSaveTemplate(); setMenuOpen(false); }} className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm hover:bg-accent">
                  <Bookmark className="h-3.5 w-3.5" /> Save as Template
                </button>
                <Separator className="my-1" />
                <button onClick={() => { handleDelete(); setMenuOpen(false); }} className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3.5 w-3.5" /> Delete Invoice
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Overdue banner */}
      {isOverdue && (
        <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400 print:hidden">
          <AlertCircle className="h-4 w-4 shrink-0" />
          This invoice is overdue — due {invoice.dueDate}
        </div>
      )}

      {/* Invoice document */}
      <div
        id="invoice-document"
        className="mx-auto max-w-3xl rounded-xl border bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-10 print:border-none print:shadow-none"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">INVOICE</h1>
            <p className="mt-0.5 text-sm text-zinc-400 dark:text-zinc-500">{invoice.number}</p>
          </div>
          <Badge className={cn(statusColors[invoice.status], "print:hidden")}>
            {invoice.status.toUpperCase()}
          </Badge>
        </div>

        <Separator className="my-6" />

        {/* Addresses + Dates */}
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">From</p>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">{invoice.fromName}</p>
            {invoice.fromEmail && <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{invoice.fromEmail}</p>}
            {invoice.fromAddress && <p className="mt-0.5 whitespace-pre-line text-sm text-zinc-500 dark:text-zinc-400">{invoice.fromAddress}</p>}
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Bill To</p>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">{invoice.toName}</p>
            {invoice.toEmail && <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{invoice.toEmail}</p>}
            {invoice.toAddress && <p className="mt-0.5 whitespace-pre-line text-sm text-zinc-500 dark:text-zinc-400">{invoice.toAddress}</p>}
          </div>
        </div>

        <div className="mt-6 flex gap-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Issued</p>
            <p className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">{invoice.createdAt}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Due</p>
            <p className={cn("mt-0.5 text-sm font-medium", isOverdue ? "text-red-600 dark:text-red-400" : "text-zinc-900 dark:text-zinc-50")}>{invoice.dueDate}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Currency</p>
            <p className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">{invoiceCurrency.code}</p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Items table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left dark:border-zinc-800">
              <th className="pb-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Description</th>
              <th className="pb-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Qty</th>
              <th className="pb-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Rate</th>
              <th className="pb-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b last:border-0 dark:border-zinc-800">
                <td className="py-3 text-zinc-700 dark:text-zinc-300">{item.description}</td>
                <td className="py-3 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{item.quantity}</td>
                <td className="py-3 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{fmt(item.rate)}</td>
                <td className="py-3 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{fmt(item.quantity * item.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="ml-auto mt-6 max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400 dark:text-zinc-500">Subtotal</span>
            <span className="tabular-nums text-zinc-700 dark:text-zinc-300">{fmt(subtotal)}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="flex justify-between">
              <span className="text-zinc-400 dark:text-zinc-500">Tax ({invoice.taxRate}%)</span>
              <span className="tabular-nums text-zinc-700 dark:text-zinc-300">{fmt(tax)}</span>
            </div>
          )}
          <div className="h-px bg-border" />
          <div className="flex justify-between pt-1 text-base font-bold">
            <span className="text-zinc-900 dark:text-zinc-50">Total</span>
            <span className="tabular-nums text-zinc-900 dark:text-zinc-50">{fmt(total)}</span>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <>
            <Separator className="my-6" />
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Notes</p>
              <p className="whitespace-pre-line text-sm text-zinc-500 dark:text-zinc-400">{invoice.notes}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
