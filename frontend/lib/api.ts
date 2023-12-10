const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type Study = {
  id: string;
  patient_id: string;
  patient_name?: string;
  modality: string;
  body_part?: string;
  status: string;
  created_at: string;
};

export type Finding = {
  id?: string;
  label: string;
  confidence: number;
  severity: string;
  bounding_box?: { x: number; y: number; width: number; height: number };
  heatmap_path?: string;
  model_name: string;
};

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { ...init, cache: "no-store" });
  if (!res.ok) throw new Error((await res.text()) || `API error ${res.status}`);
  return res.json() as Promise<T>;
}

export async function streamText(path: string, body: unknown, onToken: (token: string) => void) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok || !res.body) throw new Error("Unable to start AI stream");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onToken(decoder.decode(value, { stream: true }));
  }
}
