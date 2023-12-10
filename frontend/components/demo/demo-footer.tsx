import { Github } from "lucide-react";

export function DemoFooter() {
  return (
    <footer className="border-t border-slate-900/10 bg-white/70 px-6 py-10 text-center text-sm text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-300">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-2">
        <p className="font-semibold">© 2023 Faith Okonkwor.</p>
        <p>For demonstration purposes only.</p>
        <a
          href="https://github.com/faithokonkwor/radiology-copilot"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-700 dark:text-emerald-200 dark:hover:text-red-200"
        >
          <Github className="size-4" aria-hidden="true" />
          View Source Code
        </a>
      </div>
    </footer>
  );
}
