"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { streamText, type Finding } from "@/lib/api";

export function ReportEditor({ studyId, findings }: { studyId: string; findings: Finding[] }) {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true); setReport("");
    try { await streamText("/api/reports/stream", { study_id: studyId, findings_context: findings, indication: "Uploaded imaging study" }, (token) => setReport((v) => v + token)); }
    finally { setLoading(false); }
  }

  function exportReport() {
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `report-${studyId}.txt`; a.click(); URL.revokeObjectURL(url);
  }

  return <Card><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Report draft</h2><div className="flex gap-2"><Button onClick={generate} disabled={loading}>{loading ? "Streaming..." : "Generate"}</Button><Button variant="secondary" onClick={exportReport} disabled={!report}>Export</Button></div></div><textarea className="min-h-96 w-full rounded-xl border border-white/10 bg-slate-950/70 p-4 font-mono text-sm outline-none" value={report} onChange={(e) => setReport(e.target.value)} placeholder="AI-generated report will stream here..." /></Card>;
}
