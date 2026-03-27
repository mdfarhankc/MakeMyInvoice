"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowDown, ArrowUp, FileDown, FileText, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Invoice, calculateTotal } from "@/lib/types";
import { getInvoices } from "@/lib/invoice-store";
import { useCurrency } from "@/lib/currency-context";
import { currencies, formatAmount } from "@/lib/currency";
import { cn } from "@/lib/utils";

const statusColors: Record<Invoice["status"], string> = {
  draft: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  sent: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  paid: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

const statuses: Array<Invoice["status"] | "all"> = ["all", "draft", "sent", "paid"];

function SortButton({ active, dir, onClick, className, children }: { active: boolean; dir: "asc" | "desc"; onClick: () => void; className?: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn("inline-flex items-center gap-1 hover:text-foreground transition-colors", className)}>
      {children}
      {active && (dir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
    </button>
  );
}

function isOverdue(inv: Invoice): boolean {
  if (inv.status === "paid") return false;
  return new Date(inv.dueDate) < new Date(new Date().toISOString().split("T")[0]);
}

export function InvoiceList() {
  const { currency } = useCurrency();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Invoice["status"] | "all">("all");
  const [sortKey, setSortKey] = useState<"date" | "client" | "amount" | "status">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    setInvoices(getInvoices());
    setLoaded(true);
  }, []);

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "date" ? "desc" : "asc");
    }
  }

  const filtered = useMemo(() => {
    let list = invoices;
    if (statusFilter !== "all") {
      list = list.filter((inv) => inv.status === statusFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (inv) =>
          inv.number.toLowerCase().includes(q) ||
          inv.toName.toLowerCase().includes(q) ||
          inv.fromName.toLowerCase().includes(q) ||
          inv.toEmail.toLowerCase().includes(q),
      );
    }
    const sorted = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "date":
          cmp = a.dueDate.localeCompare(b.dueDate);
          break;
        case "client":
          cmp = a.toName.localeCompare(b.toName);
          break;
        case "amount":
          cmp = calculateTotal(a.items, a.taxRate) - calculateTotal(b.items, b.taxRate);
          break;
        case "status": {
          const order = { draft: 0, sent: 1, paid: 2 };
          cmp = order[a.status] - order[b.status];
          break;
        }
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [invoices, query, statusFilter, sortKey, sortDir]);

  if (!loaded) return null;

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <FileText className="text-muted-foreground mb-4 h-16 w-16" />
        <h2 className="mb-2 text-xl font-semibold">No invoices yet</h2>
        <p className="text-muted-foreground mb-6">Create your first invoice to get started.</p>
        <Button asChild size="lg">
          <Link href="/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </div>
    );
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((inv) => inv.id)));
    }
  }

  function exportCsv() {
    const toExport = selected.size > 0
      ? filtered.filter((inv) => selected.has(inv.id))
      : filtered;
    const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const header = ["Invoice #", "Status", "Issue Date", "Due Date", "From", "Client", "Client Email", "Currency", "Subtotal", "Tax Rate %", "Tax", "Total"];
    const rows = toExport.map((inv) => {
      const c = getInvoiceCurrency(inv);
      const sub = calculateTotal(inv.items, 0);
      const total = calculateTotal(inv.items, inv.taxRate);
      const tax = total - sub;
      return [
        escape(inv.number), inv.status, inv.createdAt, inv.dueDate,
        escape(inv.fromName), escape(inv.toName), escape(inv.toEmail),
        c.code, sub.toFixed(2), inv.taxRate.toString(), tax.toFixed(2), total.toFixed(2),
      ];
    });
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoices-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported", { description: `${toExport.length} invoice${toExport.length !== 1 ? "s" : ""}` });
    setSelected(new Set());
  }

  function getInvoiceCurrency(inv: Invoice) {
    if (inv.currency) {
      return currencies.find((c) => c.code === inv.currency) ?? currency;
    }
    return currency;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {selected.size > 0
            ? `${selected.size} of ${filtered.length} selected`
            : `${invoices.length} invoice${invoices.length !== 1 ? "s" : ""}`}
        </p>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button onClick={() => setSelected(new Set())} className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">
              Clear selection
            </button>
          )}
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground" onClick={exportCsv}>
            <FileDown className="h-3.5 w-3.5" />
            {selected.size > 0 ? `Export ${selected.size}` : "Export All"}
          </Button>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by invoice #, client, or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-1.5">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="text-muted-foreground mb-3 h-10 w-10" />
          <p className="text-muted-foreground">No invoices match your search.</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selected.size === filtered.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                </TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>
                  <SortButton active={sortKey === "client"} dir={sortDir} onClick={() => toggleSort("client")}>Client</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton active={sortKey === "date"} dir={sortDir} onClick={() => toggleSort("date")}>Due Date</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton active={sortKey === "status"} dir={sortDir} onClick={() => toggleSort("status")}>Status</SortButton>
                </TableHead>
                <TableHead className="text-right">
                  <SortButton active={sortKey === "amount"} dir={sortDir} onClick={() => toggleSort("amount")} className="justify-end">Amount</SortButton>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inv) => {
                const overdue = isOverdue(inv);
                return (
                  <TableRow key={inv.id} className={cn("cursor-pointer", overdue && "bg-red-50/50 dark:bg-red-950/20", selected.has(inv.id) && "bg-primary/5")} onClick={() => (window.location.href = `/invoices/${inv.id}`)}>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(inv.id)}
                        onChange={() => toggleSelect(inv.id)}
                        className="h-4 w-4 rounded border-border accent-primary"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{inv.number}</TableCell>
                    <TableCell>{inv.toName}</TableCell>
                    <TableCell>
                      <span className={cn(overdue && "text-red-600 dark:text-red-400")}>
                        {inv.dueDate}
                      </span>
                      {overdue && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                          <AlertCircle className="h-3 w-3" />
                          Overdue
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[inv.status]}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      {formatAmount(calculateTotal(inv.items, inv.taxRate), getInvoiceCurrency(inv))}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
