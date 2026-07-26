"use client";

import { useState } from "react";

export function AdminCopyButton({ text, label = "Копировать" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button className="small-action" type="button" onClick={copyText}>
      {copied ? "Скопировано" : label}
    </button>
  );
}
