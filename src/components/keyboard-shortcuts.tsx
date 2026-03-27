"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Keyboard } from "lucide-react";

const shortcuts = [
  { key: "N", desc: "New invoice" },
  { key: "D", desc: "Dashboard" },
  { key: "/", desc: "Focus search" },
  { key: "T", desc: "Toggle theme" },
  { key: "?", desc: "Show shortcuts" },
];

export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if typing in an input
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target as HTMLElement).isContentEditable) return;

      switch (e.key.toLowerCase()) {
        case "n":
          e.preventDefault();
          router.push("/invoices/new");
          break;
        case "d":
          e.preventDefault();
          router.push("/invoices");
          break;
        case "/":
          e.preventDefault();
          // Focus the search input on the dashboard
          const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          } else if (pathname !== "/invoices") {
            router.push("/invoices");
          }
          break;
        case "t":
          e.preventDefault();
          setTheme(theme === "dark" ? "light" : "dark");
          break;
        case "?":
          e.preventDefault();
          setShowHelp((prev) => !prev);
          break;
        case "escape":
          setShowHelp(false);
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, pathname, theme, setTheme]);

  return (
    <>
      {/* Help dialog */}
      {showHelp && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={() => setShowHelp(false)} />
          <div className="fixed left-1/2 top-1/2 z-[61] w-80 -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-popover p-5 shadow-2xl">
            <div className="mb-4 flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Keyboard Shortcuts</h3>
            </div>
            <div className="space-y-2">
              {shortcuts.map((s) => (
                <div key={s.key} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{s.desc}</span>
                  <kbd className="rounded-md border bg-muted px-2 py-0.5 font-mono text-xs">{s.key}</kbd>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-[11px] text-muted-foreground">Press <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">Esc</kbd> to close</p>
          </div>
        </>
      )}
    </>
  );
}
