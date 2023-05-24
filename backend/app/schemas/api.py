from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str = Field(min_length=8)


class StudyRead(BaseModel):
    id: str
    patient_id: str
    patient_name: str | None
    modality: str
    body_part: str | None
    status: str
    created_at: datetime


class FindingRead(BaseModel):
    id: str
    label: str
    confidence: float
    severity: str
    bounding_box: dict | None = None
    heatmap_path: str | None = None
    model_name: str


class ReportDraftRequest(BaseModel):
    study_id: str
    indication: str | None = None
    technique: str | None = None
    findings_context: list[FindingRead] = []


class ReportRead(BaseModel):
    id: str
    study_id: str
    status: str
    indication: str | None
    technique: str | None
    findings: str
    impression: str
    created_at: datetime


class ChatRequest(BaseModel):
    study_id: str | None = None
    message: str
    context: str | None = None


class AnalyticsSummary(BaseModel):
    total_studies: int
    pending_reports: int
    critical_findings: int
    avg_turnaround_minutes: float
