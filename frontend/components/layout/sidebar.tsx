import Link from "next/link";
import { Activity, FileText, LayoutDashboard, UploadCloud } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload", icon: UploadCloud },
  { href: "/reports", label: "Reports", icon: FileText }
];

export function Sidebar() {
  return <aside className="hidden min-h-screen w-72 border-r border-white/10 bg-slate-950/70 p-6 lg:block">
    <div className="mb-10 flex items-center gap-3 text-xl font-bold"><Activity className="text-cyan-300" /> Radiology Copilot</div>
    <nav className="space-y-2">{items.map((item) => <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2 text-slate-300 hover:bg-white/10 hover:text-white"><item.icon size={18} />{item.label}</Link>)}</nav>
  </aside>;
}
