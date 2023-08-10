import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return <main className="flex min-h-screen items-center justify-center p-6"><Card className="w-full max-w-md"><h1 className="text-2xl font-bold">Sign in</h1><p className="mt-2 text-slate-400">Authentication endpoints are ready for JWT integration.</p><form className="mt-6 space-y-3"><Input placeholder="Email" type="email" /><Input placeholder="Password" type="password" /><Button className="w-full" type="button">Continue</Button></form><Link href="/dashboard" className="mt-4 block text-center text-sm text-cyan-200">Continue to demo dashboard</Link></Card></main>;
}
