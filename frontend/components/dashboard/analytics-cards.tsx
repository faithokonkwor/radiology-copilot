import { Card } from "@/components/ui/card";

export function AnalyticsCards({ data }: { data: { total_studies: number; pending_reports: number; critical_findings: number; avg_turnaround_minutes: number } }) {
  const cards = [
    ["Studies", data.total_studies],
    ["Pending reports", data.pending_reports],
    ["Critical findings", data.critical_findings],
    ["Avg TAT", `${data.avg_turnaround_minutes}m`]
  ];
  return <div className="grid gap-4 md:grid-cols-4">{cards.map(([label, value]) => <Card key={label.toString()}><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></Card>)}</div>;
}
