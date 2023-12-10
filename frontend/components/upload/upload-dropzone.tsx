"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function UploadDropzone() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  async function upload() {
    if (!file) return;
    setStatus("Uploading and running AI detection...");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_URL}/api/studies/upload`, { method: "POST", body: form });
    if (!res.ok) { setStatus("Upload failed. Check API logs and file format."); return; }
    const data = await res.json();
    setStatus(`Study ${data.study_id} is ready with ${data.detections.length} AI finding(s).`);
  }

  return <Card className="mx-auto max-w-3xl text-center">
    <label className="flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-cyan-300/30 p-12 hover:bg-white/5">
      <UploadCloud className="mb-4 text-cyan-300" size={44} />
      <span className="text-xl font-semibold">Drop CT/MRI/X-ray DICOM files</span>
      <span className="mt-2 text-slate-400">DICOM metadata is parsed server-side; pixels remain in controlled storage.</span>
      <input type="file" accept=".dcm,application/dicom" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
    </label>
    {file && <p className="mt-4 text-slate-300">Selected: {file.name}</p>}
    <Button className="mt-6" onClick={upload} disabled={!file}>Upload study</Button>
    {status && <p className="mt-4 text-sm text-cyan-100">{status}</p>}
  </Card>;
}
