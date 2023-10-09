"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { streamText } from "@/lib/api";

export function ChatAssistant({ studyId }: { studyId: string }) {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask() {
    setLoading(true); setAnswer("");
    try { await streamText("/api/assistant/stream", { study_id: studyId, message }, (token) => setAnswer((v) => v + token)); }
    finally { setLoading(false); }
  }

  return <Card><h2 className="mb-3 font-semibold">AI assistant</h2><div className="min-h-28 rounded-xl bg-slate-950/70 p-3 text-sm text-slate-200">{answer || "Ask about differential considerations, report phrasing, or follow-up recommendations."}</div><div className="mt-3 flex gap-2"><Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask a study-specific question..." /><Button onClick={ask} disabled={loading || !message}>Send</Button></div></Card>;
}
