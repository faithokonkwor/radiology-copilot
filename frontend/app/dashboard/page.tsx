import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { AnalyticsCards } from "@/components/dashboard/analytics-cards";
import { Card } from "@/components/ui/card";
import { api, Study } from "@/lib/api";

export default async function DashboardPage() {
  const [summary, studies] = await Promise.all([
    api<{ total_studies: number; pending_reports: number; critical_findings: number; avg_turnaround_minutes: number }>("/api/analytics/summary").catch(() => ({ total_studies: 0, pending_reports: 0, critical_findings: 0, avg_turnaround_minutes: 0 })),
    api<Study[]>("/api/studies").catch(() => [])
  ]);
  return <div className="flex"><Sidebar /><main className="w-full space-y-6 p-6 lg:p-10"><h1 className="text-3xl font-bold">Reading worklist</h1><AnalyticsCards data={summary} /><Card><h2 className="mb-4 font-semibold">Recent studies</h2><div className="space-y-3">{studies.map((study) => <Link href={`/studies/${study.id}`} key={study.id} className="grid rounded-xl bg-white/5 p-4 hover:bg-white/10 md:grid-cols-5"><span>{study.patient_id}</span><span>{study.modality}</span><span>{study.body_part ?? "—"}</span><span>{study.status}</span><span>{new Date(study.created_at).toLocaleString()}</span></Link>)}{studies.length === 0 && <p className="text-slate-400">No studies yet. Upload a DICOM file to begin.</p>}</div></Card></main></div>;
}
