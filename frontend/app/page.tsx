"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  CircleDot,
  FileText,
  Gauge,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  PlayCircle,
  ScanLine,
  Sparkles,
  UploadCloud,
  Zap
} from "lucide-react";
import { ThemeToggle } from "@/components/demo/theme-toggle";
import { DemoFooter } from "@/components/demo/demo-footer";

const metrics = [
  { label: "Demo studies triaged", value: "1,284", accent: "text-emerald-500" },
  { label: "Median draft time", value: "41s", accent: "text-red-500" },
  { label: "AI findings surfaced", value: "97.2%", accent: "text-emerald-500" }
];

const workflow = [
  { icon: UploadCloud, title: "Upload", body: "Drag DICOM CT, MRI, and X-ray studies into a protected ingestion flow." },
  { icon: ScanLine, title: "Review", body: "Inspect the study with a Cornerstone-ready viewport and visual overlays." },
  { icon: BrainCircuit, title: "Detect", body: "Run MONAI/PyTorch inference boundaries for abnormality detection." },
  { icon: FileText, title: "Report", body: "Stream a structured report draft and export it for sign-off workflows." }
];

const findings = [
  { label: "Right upper-lobe opacity", confidence: 0.91, tone: "bg-red-500" },
  { label: "No midline shift", confidence: 0.98, tone: "bg-emerald-500" },
  { label: "Follow-up comparison advised", confidence: 0.76, tone: "bg-amber-500" }
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7fbf4] text-slate-950 transition-colors dark:bg-[#07100d] dark:text-white">
      <div className="pointer-events-none absolute inset-0 demo-grid opacity-60" />
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-emerald-400/35 blur-3xl dark:bg-emerald-500/25" />
      <div className="pointer-events-none absolute -right-32 top-20 h-[30rem] w-[30rem] rounded-full bg-red-500/30 blur-3xl dark:bg-red-600/25" />
      <div className="pointer-events-none absolute bottom-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-lime-300/25 blur-3xl dark:bg-lime-500/10" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
          <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-red-500 to-emerald-500 text-white shadow-xl shadow-red-950/20">
            <Activity className="size-6" />
          </span>
          <span className="text-lg sm:text-xl">Radiology Copilot</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
          <a href="#workflow" className="hover:text-emerald-600 dark:hover:text-emerald-300">Workflow</a>
          <a href="#viewer" className="hover:text-red-600 dark:hover:text-red-300">AI Viewer</a>
          <a href="#security" className="hover:text-emerald-600 dark:hover:text-emerald-300">Security</a>
        </nav>
        <ThemeToggle />
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1.02fr_.98fr] lg:pt-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm dark:text-emerald-200">
            <Sparkles className="size-4 animate-pulse" />
            radiologist-in-the-loop AI
          </div>
          <h1 className="max-w-4xl text-balance text-5xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
            A cinematic AI workspace for faster, safer radiology report drafts.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
            This demo presents the product vision: DICOM upload, AI abnormality detection, highlighted regions, streaming report generation, chat assistance, authentication-ready flows, and analytics in a modern SaaS experience.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard" className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-bold text-white shadow-2xl shadow-emerald-950/20 transition hover:-translate-y-1 hover:bg-emerald-700 dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-100">
              Launch demo console <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
            <a href="#viewer" className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-6 py-3 font-bold text-red-800 transition hover:-translate-y-1 hover:bg-red-500/15 dark:text-red-200">
              <PlayCircle className="size-4" /> Watch AI triage
            </a>
          </div>
          <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-3xl border border-slate-900/10 bg-white/70 p-5 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-white/10 dark:bg-white/5">
                <p className={`text-3xl font-black ${metric.accent}`}>{metric.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="viewer" className="relative">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-red-500/30 via-transparent to-emerald-500/30 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-900/10 bg-slate-950 p-4 shadow-2xl shadow-slate-950/30 dark:border-white/10">
            <div className="mb-3 flex items-center justify-between text-white">
              <div className="flex items-center gap-2 text-sm font-bold"><CircleDot className="size-4 animate-pulse text-red-400" /> Live AI Viewport</div>
              <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">MONAI pipeline</div>
            </div>
            <div className="relative aspect-[1.1/1] overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_50%_45%,rgba(148,163,184,.35),transparent_18rem),linear-gradient(135deg,#020617,#111827)]">
              <div className="absolute left-[28%] top-[18%] h-[58%] w-[42%] rounded-[45%] border border-slate-500/40 bg-slate-300/10 blur-[1px]" />
              <div className="absolute left-[37%] top-[36%] h-[24%] w-[20%] animate-scan rounded-2xl border-2 border-red-400 bg-red-500/15 shadow-[0_0_40px_rgba(248,113,113,.45)]">
                <span className="absolute -top-8 left-0 rounded-full bg-red-400 px-3 py-1 text-xs font-black text-red-950">91% opacity</span>
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-black/45 p-4 text-white backdrop-blur">
                <div className="mb-3 flex items-center justify-between"><span className="font-bold">Suspicious regions</span><Zap className="size-4 text-emerald-300" /></div>
                <div className="space-y-2">
                  {findings.map((finding) => (
                    <div key={finding.label} className="flex items-center gap-3 text-sm">
                      <span className={`size-2 rounded-full ${finding.tone}`} />
                      <span className="flex-1 text-slate-200">{finding.label}</span>
                      <span className="font-bold">{Math.round(finding.confidence * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-bold uppercase tracking-[0.3em] text-red-600 dark:text-red-300">End-to-end workflow</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Built like a production product, shown as a polished demo.</h2>
          </div>
          <p className="max-w-xl text-slate-700 dark:text-slate-300">Animated touchpoints show how the real backend architecture connects upload, AI triage, report drafting, assistant chat, and analytics.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {workflow.map((step, index) => (
            <article key={step.title} className="group rounded-[1.75rem] border border-slate-900/10 bg-white/75 p-6 shadow-xl shadow-slate-900/5 backdrop-blur transition hover:-translate-y-2 hover:border-emerald-500/40 dark:border-white/10 dark:bg-white/5">
              <div className="mb-6 flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-red-500 text-white shadow-lg"><step.icon className="size-6" /></span>
                <span className="text-sm font-black text-slate-300 dark:text-slate-600">0{index + 1}</span>
              </div>
              <h3 className="text-xl font-black">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="security" className="relative z-10 mx-auto grid max-w-7xl gap-6 px-6 py-16 lg:grid-cols-[.8fr_1.2fr]">
        <div className="rounded-[2rem] border border-red-500/20 bg-red-500/10 p-8 dark:bg-red-500/5">
          <LockKeyhole className="mb-5 size-10 text-red-600 dark:text-red-300" />
          <h2 className="text-3xl font-black">Designed around clinical review and responsible AI.</h2>
          <p className="mt-4 leading-7 text-slate-700 dark:text-slate-300">This is a demonstration interface, but the architecture keeps the radiologist in control with draft status, confidence labels, and explicit validation language.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Layers3, title: "Clean layers", body: "Frontend, API, AI services, and database remain independently replaceable." },
            { icon: MessageSquareText, title: "Streaming UX", body: "Report and assistant text streams token-by-token for a premium AI feel." },
            { icon: Gauge, title: "Operational view", body: "Dashboard cards communicate throughput, pending work, and critical findings." },
            { icon: BadgeCheck, title: "Export ready", body: "Draft reports can be edited and exported from the review workspace." }
          ].map((item) => (
            <div key={item.title} className="rounded-[1.5rem] border border-slate-900/10 bg-white/70 p-5 backdrop-blur dark:border-white/10 dark:bg-white/5 sm:col-span-1 first:sm:col-span-2 last:sm:col-span-2">
              <item.icon className="mb-4 size-7 text-emerald-600 dark:text-emerald-300" />
              <h3 className="font-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <DemoFooter />
    </main>
  );
}
