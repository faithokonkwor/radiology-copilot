import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-white/10 bg-card/80 p-5 shadow-glow backdrop-blur", className)} {...props} />;
}
