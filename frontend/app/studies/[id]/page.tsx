import { Sidebar } from "@/components/layout/sidebar";
import { DicomViewer } from "@/components/dicom/dicom-viewer";
import { ReportEditor } from "@/components/reports/report-editor";
import { ChatAssistant } from "@/components/ai/chat-assistant";
import { api, Finding } from "@/lib/api";

export default async function StudyPage({ params }: { params: { id: string } }) {
  const findings = await api<Finding[]>(`/api/studies/${params.id}/findings`).catch(() => []);
  return <div className="flex"><Sidebar /><main className="grid w-full gap-6 p-6 lg:grid-cols-[1.1fr_.9fr] lg:p-10"><section><h1 className="mb-4 text-3xl font-bold">Study review</h1><DicomViewer findings={findings} /></section><section className="space-y-6"><ReportEditor studyId={params.id} findings={findings} /><ChatAssistant studyId={params.id} /></section></main></div>;
}

export function generateStaticParams() {
  return [{ id: "demo-study" }];
}
