import { Sidebar } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";

export default function ReportsPage() {
  return <div className="flex"><Sidebar /><main className="w-full p-6 lg:p-10"><h1 className="mb-6 text-3xl font-bold">Reports</h1><Card><p className="text-slate-300">Saved reports can be listed, filtered, signed, exported to PDF, or integrated with RIS/PACS from this workspace.</p></Card></main></div>;
}
