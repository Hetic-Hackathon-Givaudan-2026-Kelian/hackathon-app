import json
from datetime import datetime
from pathlib import Path
from secrets import token_hex

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.config import settings

router = APIRouter(prefix="/briefs", tags=["Briefs"])


class AttachedAroma(BaseModel):
    source_id: str
    name: str


class BriefRequest(BaseModel):
    answers: list[str] = Field(min_length=1, description="Ce que le client a dit à Umi")
    aromas: list[AttachedAroma] = Field(default_factory=list)
    message: str | None = Field(default=None, max_length=2000)


class BriefResponse(BaseModel):
    id: str
    status: str
    created_at: datetime


@router.post("", response_model=BriefResponse, status_code=201)
def send_brief(brief: BriefRequest) -> BriefResponse:
    """Enregistre la demande du client pour les experts Givaudan.

    Prototype : la demande est écrite dans un fichier JSON. En V1, elle serait
    transmise aux outils existants (CRM, suivi des projets) sans ressaisie.
    """
    now = datetime.now().astimezone()
    brief_id = f"DEM-{now:%Y%m%d}-{token_hex(2).upper()}"

    folder = Path(settings.briefs_dir)
    try:
        folder.mkdir(parents=True, exist_ok=True)
        (folder / f"{brief_id}.json").write_text(
            json.dumps(
                {
                    "id": brief_id,
                    "created_at": now.isoformat(),
                    **brief.model_dump(),
                },
                ensure_ascii=False,
                indent=2,
            ),
            encoding="utf-8",
        )
    except OSError as e:
        raise HTTPException(
            status_code=503, detail="La demande n'a pas pu être enregistrée."
        ) from e

    return BriefResponse(id=brief_id, status="sent", created_at=now)
