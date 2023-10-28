"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import type { Finding } from "@/lib/api";

export function DicomViewer({ findings }: { findings: Finding[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function initCornerstone() {
      const cornerstone = await import("@cornerstonejs/core");
      await cornerstone.init();
      if (mounted) setReady(true);
    }
    initCornerstone().catch(() => setReady(false));
    return () => { mounted = false; };
  }, []);

  return <Card className="relative overflow-hidden p-0">
    <div ref={ref} className="flex aspect-square min-h-[420px] items-center justify-center bg-black text-slate-500">
      {ready ? "Cornerstone.js viewport ready — connect imageId streaming endpoint" : "Initializing DICOM viewer..."}
    </div>
    {findings.map((finding) => finding.bounding_box && <div key={finding.id ?? finding.label} className="absolute border-2 border-amber-300 bg-amber-300/10" style={{ left: `${finding.bounding_box.x * 100}%`, top: `${finding.bounding_box.y * 100}%`, width: `${finding.bounding_box.width * 100}%`, height: `${finding.bounding_box.height * 100}%` }}><span className="bg-amber-300 px-2 py-1 text-xs font-bold text-black">{finding.label} {Math.round(finding.confidence * 100)}%</span></div>)}
  </Card>;
}
