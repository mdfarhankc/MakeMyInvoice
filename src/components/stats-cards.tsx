"use client";

import { useEffect, useState } from "react";
import { DollarSign, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type Invoice, calculateTotal } from "@/lib/types";
import { getInvoices } from "@/lib/invoice-store";
import { useCurrency } from "@/lib/currency-context";
import { formatAmount } from "@/lib/currency";

export function StatsCards() {
  const { currency } = useCurrency();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setInvoices(getInvoices());
    setLoaded(true);
  }, []);

  if (!loaded) return null;
  if (invoices.length === 0) return null;

  const today = new Date().toISOString().split("T")[0];

  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + calculateTotal(inv.items, inv.taxRate), 0);

  const pendingAmount = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + calculateTotal(inv.items, inv.taxRate), 0);

  const overdueCount = invoices.filter(
    (inv) => inv.status !== "paid" && new Date(inv.dueDate) < new Date(today),
  ).length;

  const paidCount = invoices.filter((inv) => inv.status === "paid").length;

  const stats = [
    {
      label: "Total Revenue",
      value: formatAmount(totalRevenue, currency),
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-500/10",
    },
    {
      label: "Pending",
      value: formatAmount(pendingAmount, currency),
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-500/10",
    },
    {
      label: "Overdue",
      value: overdueCount.toString(),
      icon: AlertCircle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-100 dark:bg-red-500/10",
    },
    {
      label: "Paid",
      value: paidCount.toString(),
      icon: CheckCircle2,
      color: "text-zinc-600 dark:text-zinc-400",
      bg: "bg-zinc-100 dark:bg-zinc-500/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs font-medium">{stat.label}</p>
              <p className="truncate text-lg font-bold tabular-nums">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
