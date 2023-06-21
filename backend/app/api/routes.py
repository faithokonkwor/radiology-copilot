from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import get_settings
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_session
from app.models.domain import Finding, Report, Series, Study, User
from app.schemas.api import AnalyticsSummary, ChatRequest, LoginRequest, ReportDraftRequest, UserCreate
from app.services.ai_detection import AbnormalityDetectionService
from app.services.imaging import DicomStorageService
from app.services.reporting import ReportGenerationService

router = APIRouter(prefix="/api")


@router.post("/auth/register")
async def register(payload: UserCreate, session: AsyncSession = Depends(get_session)):
    exists = await session.scalar(select(User).where(User.email == payload.email))
    if exists:
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(email=payload.email, full_name=payload.full_name, hashed_password=hash_password(payload.password))
    session.add(user)
    await session.commit()
    return {"id": user.id, "email": user.email, "access_token": create_access_token(user.email)}


@router.post("/auth/login")
async def login(payload: LoginRequest, session: AsyncSession = Depends(get_session)):
    user = await session.scalar(select(User).where(User.email == payload.email))
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_access_token(user.email), "token_type": "bearer"}


@router.post("/studies/upload")
async def upload_study(file: UploadFile = File(...), session: AsyncSession = Depends(get_session)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing filename")
    settings = get_settings()
    stored = await DicomStorageService(settings.upload_dir).save_upload(file.filename, await file.read())
    meta = stored["metadata"]
    study = Study(
        patient_id=meta["patient_id"],
        patient_name=meta.get("patient_name"),
        modality=meta["modality"],
        body_part=meta.get("body_part"),
        status="processing",
    )
    session.add(study)
    await session.flush()
    session.add(Series(study_id=study.id, series_instance_uid=meta.get("series_instance_uid"), description=meta.get("description"), image_count=1, storage_path=stored["path"]))

    detections = AbnormalityDetectionService().analyze(stored["path"])
    for detection in detections:
        session.add(Finding(study_id=study.id, **detection.__dict__))
    study.status = "ready"
    await session.commit()
    return {"study_id": study.id, "status": study.status, "detections": [d.__dict__ for d in detections]}


@router.get("/studies")
async def list_studies(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Study).order_by(Study.created_at.desc()).limit(50))
    return result.scalars().all()


@router.get("/studies/{study_id}/findings")
async def findings(study_id: str, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Finding).where(Finding.study_id == study_id))
    return result.scalars().all()


@router.post("/reports/stream")
async def stream_report(payload: ReportDraftRequest):
    service = ReportGenerationService()
    return StreamingResponse(service.stream_report(payload.model_dump()), media_type="text/plain")


@router.post("/reports")
async def save_report(payload: dict, session: AsyncSession = Depends(get_session)):
    report = Report(**payload)
    session.add(report)
    await session.commit()
    return report


@router.get("/reports/{study_id}")
async def get_reports(study_id: str, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Report).where(Report.study_id == study_id).order_by(Report.created_at.desc()))
    return result.scalars().all()


@router.post("/assistant/stream")
async def assistant_chat(payload: ChatRequest):
    service = ReportGenerationService()
    return StreamingResponse(service.stream_chat(payload.message, payload.context), media_type="text/plain")


@router.get("/analytics/summary", response_model=AnalyticsSummary)
async def analytics_summary(session: AsyncSession = Depends(get_session)):
    total_studies = await session.scalar(select(func.count(Study.id))) or 0
    pending_reports = await session.scalar(select(func.count(Study.id)).where(Study.status != "signed")) or 0
    critical_findings = await session.scalar(select(func.count(Finding.id)).where(Finding.severity == "critical")) or 0
    return AnalyticsSummary(
        total_studies=total_studies,
        pending_reports=pending_reports,
        critical_findings=critical_findings,
        avg_turnaround_minutes=18.4,
    )
