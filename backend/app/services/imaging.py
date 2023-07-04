from pathlib import Path
from uuid import uuid4
import pydicom


class DicomStorageService:
    def __init__(self, upload_dir: str):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    async def save_upload(self, filename: str, content: bytes) -> dict:
        study_dir = self.upload_dir / str(uuid4())
        study_dir.mkdir(parents=True, exist_ok=True)
        safe_name = Path(filename).name
        path = study_dir / safe_name
        path.write_bytes(content)
        metadata = self.extract_metadata(path)
        return {"path": str(path), "metadata": metadata}

    def extract_metadata(self, path: Path) -> dict:
        try:
            ds = pydicom.dcmread(path, stop_before_pixels=True, force=True)
            return {
                "patient_id": str(getattr(ds, "PatientID", "UNKNOWN")),
                "patient_name": str(getattr(ds, "PatientName", "")) or None,
                "modality": self.normalize_modality(str(getattr(ds, "Modality", "OTHER"))),
                "body_part": str(getattr(ds, "BodyPartExamined", "")) or None,
                "series_instance_uid": str(getattr(ds, "SeriesInstanceUID", "")) or None,
                "description": str(getattr(ds, "SeriesDescription", "")) or None,
            }
        except Exception:
            return {"patient_id": "UNKNOWN", "patient_name": None, "modality": "OTHER", "body_part": None}

    @staticmethod
    def normalize_modality(modality: str) -> str:
        if modality in {"CT", "MR", "MRI"}:
            return "MRI" if modality in {"MR", "MRI"} else "CT"
        if modality in {"CR", "DX", "XR", "XRAY"}:
            return "XRAY"
        if modality == "US":
            return "US"
        return "OTHER"
