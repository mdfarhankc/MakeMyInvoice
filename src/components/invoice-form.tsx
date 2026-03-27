"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  type Invoice,
  type InvoiceItem,
  generateId,
  generateInvoiceNumber,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from "@/lib/types";
import { saveInvoice, getSavedSender, saveSender, getTemplates, getClients, saveClient, type InvoiceTemplate, type Client } from "@/lib/invoice-store";
import { useCurrency } from "@/lib/currency-context";
import { formatAmount } from "@/lib/currency";

function createEmptyItem(): InvoiceItem {
  return { id: generateId(), description: "", quantity: 1, rate: 0 };
}

interface InvoiceFormProps {
  invoice?: Invoice;
}

const DRAFT_KEY = "invoicer_draft";

interface DraftData {
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  toName: string;
  toEmail: string;
  toAddress: string;
  issueDate?: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
}

function loadDraft(): DraftData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as DraftData) : null;
  } catch {
    return null;
  }
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

export function InvoiceForm({ invoice }: InvoiceFormProps) {
  const router = useRouter();
  const { currency } = useCurrency();
  const isEditing = !!invoice;
  const saved = !isEditing ? getSavedSender() : null;
  const draft = !isEditing ? loadDraft() : null;
  const hasDraft = !!draft?.toName;
  const mountedRef = useRef(false);

  const [fromName, setFromName] = useState(invoice?.fromName ?? draft?.fromName ?? saved?.fromName ?? "");
  const [fromEmail, setFromEmail] = useState(invoice?.fromEmail ?? draft?.fromEmail ?? saved?.fromEmail ?? "");
  const [fromAddress, setFromAddress] = useState(invoice?.fromAddress ?? draft?.fromAddress ?? saved?.fromAddress ?? "");
  const [toName, setToName] = useState(invoice?.toName ?? draft?.toName ?? "");
  const [toEmail, setToEmail] = useState(invoice?.toEmail ?? draft?.toEmail ?? "");
  const [toAddress, setToAddress] = useState(invoice?.toAddress ?? draft?.toAddress ?? "");
  const [issueDate, setIssueDate] = useState(
    invoice?.createdAt ?? draft?.issueDate ?? new Date().toISOString().split("T")[0],
  );
  const [dueDate, setDueDate] = useState(
    invoice?.dueDate ?? draft?.dueDate ?? new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  );
  const [items, setItems] = useState<InvoiceItem[]>(
    invoice?.items ?? draft?.items ?? [createEmptyItem()],
  );
  const [taxRate, setTaxRate] = useState(invoice?.taxRate ?? draft?.taxRate ?? 0);
  const [notes, setNotes] = useState(invoice?.notes ?? draft?.notes ?? "");
  const [showDraftBanner, setShowDraftBanner] = useState(hasDraft);

  // Auto-save draft (new invoices only), debounced 500ms
  useEffect(() => {
    if (isEditing) return;
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const timer = setTimeout(() => {
      const data: DraftData = { fromName, fromEmail, fromAddress, toName, toEmail, toAddress, issueDate, dueDate, items, taxRate, notes };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    }, 500);
    return () => clearTimeout(timer);
  }, [isEditing, fromName, fromEmail, fromAddress, toName, toEmail, toAddress, issueDate, dueDate, items, taxRate, notes]);

  function addItem() {
    setItems([...items, createEmptyItem()]);
  }

  function duplicateItem(id: string) {
    const idx = items.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const clone = { ...items[idx], id: generateId() };
    const next = [...items];
    next.splice(idx + 1, 0, clone);
    setItems(next);
  }

  function removeItem(id: string) {
    if (items.length === 1) return;
    setItems(items.filter((i) => i.id !== id));
  }

  function updateItem(id: string, field: keyof InvoiceItem, value: string | number) {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const inv: Invoice = {
      id: invoice?.id ?? generateId(),
      number: invoice?.number ?? generateInvoiceNumber(),
      createdAt: issueDate,
      dueDate,
      status: invoice?.status ?? "draft",
      fromName,
      fromEmail,
      fromAddress,
      toName,
      toEmail,
      toAddress,
      items,
      taxRate,
      notes,
      currency: currency.code,
    };
    saveInvoice(inv);
    saveSender({ fromName, fromEmail, fromAddress });
    const existingClient = clients.find((c) => c.name.toLowerCase() === toName.toLowerCase());
    if (!existingClient && toName.trim()) {
      saveClient({ id: generateId(), name: toName.trim(), email: toEmail.trim(), address: toAddress.trim() });
    }
    if (!isEditing) clearDraft();
    toast.success(isEditing ? "Invoice updated" : "Invoice created", {
      description: `${inv.number} — ${formatAmount(calculateTotal(items, taxRate), currency)}`,
    });
    router.push(`/invoices/${inv.id}`);
  }

  function loadTemplate(template: InvoiceTemplate) {
    setFromName(template.fromName);
    setFromEmail(template.fromEmail);
    setFromAddress(template.fromAddress);
    setToName(template.toName);
    setToEmail(template.toEmail);
    setToAddress(template.toAddress);
    setItems(template.items.map((item) => ({ ...item, id: generateId() })));
    setTaxRate(template.taxRate);
    setNotes(template.notes);
    toast.success("Template loaded", { description: template.name });
  }

  const templates = !isEditing ? getTemplates() : [];
  const clients = getClients();
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(items, taxRate);
  const total = calculateTotal(items, taxRate);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Draft banner + Template picker — compact row */}
      {(showDraftBanner || (!isEditing && templates.length > 0)) && (
        <div className="flex flex-wrap items-center gap-3">
          {showDraftBanner && (
            <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400">
              <span>Draft restored</span>
              <button
                type="button"
                className="font-medium underline underline-offset-2 hover:no-underline"
                onClick={() => {
                  clearDraft();
                  setFromName(saved?.fromName ?? "");
                  setFromEmail(saved?.fromEmail ?? "");
                  setFromAddress(saved?.fromAddress ?? "");
                  setToName("");
                  setToEmail("");
                  setToAddress("");
                  setIssueDate(new Date().toISOString().split("T")[0]);
                  setDueDate(new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]);
                  setItems([createEmptyItem()]);
                  setTaxRate(0);
                  setNotes("");
                  setShowDraftBanner(false);
                  toast.success("Draft discarded");
                }}
              >
                Discard
              </button>
            </div>
          )}
          {!isEditing && templates.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Template:</span>
              {templates.map((t) => (
                <Button key={t.id} type="button" variant="outline" size="sm" className="h-7 rounded-md px-2.5 text-xs" onClick={() => loadTemplate(t)}>
                  {t.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* From / To / Due Date */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">From</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="fromName" className="text-xs">Name / Business</Label>
              <Input id="fromName" value={fromName} onChange={(e) => setFromName(e.target.value)} required placeholder="Your business name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fromEmail" className="text-xs">Email</Label>
              <Input id="fromEmail" type="email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fromAddress" className="text-xs">Address</Label>
              <Textarea id="fromAddress" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} placeholder="Street, City, Country" rows={2} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Bill To</CardTitle>
            {clients.length > 0 && (
              <select
                className="h-7 rounded-md border border-border bg-background px-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                value=""
                onChange={(e) => {
                  const c = clients.find((cl) => cl.id === e.target.value);
                  if (c) {
                    setToName(c.name);
                    setToEmail(c.email);
                    setToAddress(c.address);
                    toast.success("Client loaded", { description: c.name });
                  }
                }}
              >
                <option value="" disabled>Select client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="toName" className="text-xs">Name / Business</Label>
              <Input id="toName" value={toName} onChange={(e) => setToName(e.target.value)} required placeholder="Client name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="toEmail" className="text-xs">Email</Label>
              <Input id="toEmail" type="email" value={toEmail} onChange={(e) => setToEmail(e.target.value)} placeholder="client@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="toAddress" className="text-xs">Address</Label>
              <Textarea id="toAddress" value={toAddress} onChange={(e) => setToAddress(e.target.value)} placeholder="Street, City, Country" rows={2} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dates — inline row */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="issueDate" className="shrink-0 text-sm font-medium">Issue Date</Label>
          <Input id="issueDate" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="max-w-44" required />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="dueDate" className="shrink-0 text-sm font-medium">Due Date</Label>
          <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="max-w-44" required />
        </div>
      </div>

      {/* Line Items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Line Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Header row */}
          <div className="hidden gap-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground md:grid md:grid-cols-[1fr_80px_100px_100px_32px_32px]">
            <span>Description</span>
            <span>Qty</span>
            <span>Rate ({currency.symbol})</span>
            <span>Amount</span>
            <span />
            <span />
          </div>

          {items.map((item) => (
            <div key={item.id} className="grid gap-2 md:grid-cols-[1fr_80px_100px_100px_32px_32px] md:gap-3">
              <Input
                placeholder="Item description"
                value={item.description}
                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                required
              />
              <Input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                required
              />
              <Input
                type="number"
                min={0}
                step={0.01}
                value={item.rate}
                onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                required
              />
              <div className="flex items-center text-sm font-medium tabular-nums">
                {formatAmount(item.quantity * item.rate, currency)}
              </div>
              <Button type="button" variant="ghost" size="icon" className="h-9 w-8" onClick={() => duplicateItem(item.id)} title="Duplicate line">
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-9 w-8" onClick={() => removeItem(item.id)} disabled={items.length === 1}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}

          <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={addItem}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Item
          </Button>

          <Separator />

          {/* Totals */}
          <div className="ml-auto max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium tabular-nums">{formatAmount(subtotal, currency)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Tax</span>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="h-8 w-16 text-xs"
                />
                <span className="text-muted-foreground">%</span>
              </div>
              <span className="font-medium tabular-nums">{formatAmount(tax, currency)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="tabular-nums">{formatAmount(total, currency)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes — lightweight, not wrapped in Card */}
      <div className="space-y-1.5">
        <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms, bank details, thank you note..." rows={2} />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button type="submit">
          {isEditing ? "Update Invoice" : "Create Invoice"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
