import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 outline-none ring-cyan-400/40 focus:ring-2", props.className)} />;
}
