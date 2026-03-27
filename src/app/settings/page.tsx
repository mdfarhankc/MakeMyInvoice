"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getNumberingSettings, saveNumberingSettings, type NumberingSettings } from "@/lib/invoice-store";

export default function SettingsPage() {
  const [settings, setSettings] = useState<NumberingSettings | null>(null);
  const [prefix, setPrefix] = useState("");
  const [nextNumber, setNextNumber] = useState(1);
  const [padding, setPadding] = useState(4);
  const [includeDate, setIncludeDate] = useState(true);

  useEffect(() => {
    const s = getNumberingSettings();
    setSettings(s);
    setPrefix(s.prefix);
    setNextNumber(s.nextNumber);
    setPadding(s.padding);
    setIncludeDate(s.includeDate);
  }, []);

  if (!settings) return null;

  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = (now.getMonth() + 1).toString().padStart(2, "0");
  const datePart = includeDate ? `-${yy}${mm}` : "";
  const preview = `${prefix}${datePart}-${nextNumber.toString().padStart(padding, "0")}`;

  function handleSave() {
    const updated: NumberingSettings = {
      prefix: prefix.trim() || "INV",
      nextNumber: Math.max(1, nextNumber),
      padding: Math.max(1, Math.min(8, padding)),
      includeDate,
    };
    saveNumberingSettings(updated);
    setSettings(updated);
    toast.success("Numbering settings saved");
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6 md:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">Configure how your invoices are numbered.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice Numbering</CardTitle>
          <CardDescription>Set the prefix, date format, next number, and zero-padding.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="prefix">Prefix</Label>
              <Input id="prefix" value={prefix} onChange={(e) => setPrefix(e.target.value.toUpperCase())} placeholder="INV" />
              <p className="text-muted-foreground text-xs">e.g. INV, ACME, BILL</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="includeDate">Date Segment (YYMM)</Label>
              <div className="flex h-9 items-center gap-2">
                <input
                  id="includeDate"
                  type="checkbox"
                  checked={includeDate}
                  onChange={(e) => setIncludeDate(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <label htmlFor="includeDate" className="text-sm">Include {yy}{mm} in number</label>
              </div>
              <p className="text-muted-foreground text-xs">Adds YYMM after prefix</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextNumber">Next Number</Label>
              <Input id="nextNumber" type="number" min={1} value={nextNumber} onChange={(e) => setNextNumber(Number(e.target.value))} />
              <p className="text-muted-foreground text-xs">The next invoice uses this</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="padding">Zero Padding</Label>
              <Input id="padding" type="number" min={1} max={8} value={padding} onChange={(e) => setPadding(Number(e.target.value))} />
              <p className="text-muted-foreground text-xs">Digits (e.g. 4 = 0001)</p>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 px-4 py-3">
            <p className="text-muted-foreground text-xs font-medium">Preview</p>
            <p className="mt-1 text-lg font-bold tabular-nums">{preview}</p>
          </div>

          <Button onClick={handleSave}>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
