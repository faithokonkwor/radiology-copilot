from collections.abc import AsyncGenerator
from openai import AsyncOpenAI
from app.core.config import get_settings

SYSTEM_PROMPT = """You are a board-certified radiology reporting copilot. Draft concise,
structured reports with Indication, Technique, Findings, and Impression. Flag uncertainty, avoid
unsupported diagnoses, and recommend human radiologist review before sign-off."""


class ReportGenerationService:
    def __init__(self) -> None:
        settings = get_settings()
        self.model = settings.openai_model
        self.client = AsyncOpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None

    async def stream_report(self, payload: dict) -> AsyncGenerator[str, None]:
        prompt = self._build_prompt(payload)
        if not self.client:
            for chunk in self._offline_report(payload):
                yield chunk
            return

        stream = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": prompt}],
            temperature=0.2,
            stream=True,
        )
        async for event in stream:
            token = event.choices[0].delta.content or ""
            if token:
                yield token

    async def stream_chat(self, message: str, context: str | None) -> AsyncGenerator[str, None]:
        if not self.client:
            yield "I reviewed the available study context. "
            yield "Please correlate highlighted regions with the source images and clinical history."
            return
        stream = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Context: {context or 'none'}\nQuestion: {message}"},
            ],
            temperature=0.2,
            stream=True,
        )
        async for event in stream:
            token = event.choices[0].delta.content or ""
            if token:
                yield token

    def _build_prompt(self, payload: dict) -> str:
        return (
            f"Indication: {payload.get('indication') or 'Not provided'}\n"
            f"Technique: {payload.get('technique') or 'Protocol per modality'}\n"
            f"AI findings: {payload.get('findings_context', [])}\n"
            "Create a draft radiology report for radiologist review."
        )

    def _offline_report(self, payload: dict) -> list[str]:
        findings = payload.get("findings_context") or []
        finding_text = "No focal AI abnormality detected." if not findings else "; ".join(
            f"{item.get('label')} ({item.get('confidence'):.0%} confidence)" for item in findings
        )
        return [
            "INDICATION: ", payload.get("indication") or "Clinical indication not provided.", "\n\n",
            "TECHNIQUE: ", payload.get("technique") or "Images reviewed in standard planes.", "\n\n",
            "FINDINGS: ", finding_text, "\n\n",
            "IMPRESSION: Draft generated for radiologist validation; correlate with prior imaging and clinical history.",
        ]
