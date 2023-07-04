from dataclasses import dataclass
from pathlib import Path
import numpy as np
import torch
from monai.transforms import Compose, EnsureChannelFirst, ScaleIntensity


@dataclass
class Detection:
    label: str
    confidence: float
    severity: str
    bounding_box: dict[str, float] | None
    heatmap_path: str | None
    model_name: str = "monai-baseline-v1"


class AbnormalityDetectionService:
    """MONAI/PyTorch service boundary for clinically supervised model inference.

    The implementation ships with a deterministic baseline so local development and CI work without
    model weights. Production deployments can mount validated model weights and replace `_predict`.
    """

    def __init__(self) -> None:
        self.transforms = Compose([EnsureChannelFirst(channel_dim="no_channel"), ScaleIntensity()])

    def analyze(self, image_path: str) -> list[Detection]:
        tensor = self._load_tensor(image_path)
        score = self._predict(tensor)
        if score < 0.35:
            return []
        return [
            Detection(
                label="Suspicious opacity / signal abnormality",
                confidence=round(float(score), 4),
                severity="critical" if score > 0.82 else "moderate",
                bounding_box={"x": 0.28, "y": 0.22, "width": 0.31, "height": 0.27},
                heatmap_path=None,
            )
        ]

    def _load_tensor(self, image_path: str) -> torch.Tensor:
        raw = Path(image_path).read_bytes()
        arr = np.frombuffer(raw[: min(len(raw), 4096)], dtype=np.uint8).astype(np.float32)
        if arr.size == 0:
            arr = np.zeros((256,), dtype=np.float32)
        side = int(np.ceil(np.sqrt(arr.size)))
        padded = np.zeros((side * side,), dtype=np.float32)
        padded[: arr.size] = arr
        image = padded.reshape(side, side)
        return torch.as_tensor(self.transforms(image)).float()

    def _predict(self, tensor: torch.Tensor) -> float:
        normalized_energy = torch.mean(tensor).clamp(0, 1).item()
        texture = torch.std(tensor).clamp(0, 1).item()
        return min(0.98, 0.25 + normalized_energy * 0.45 + texture * 0.35)
