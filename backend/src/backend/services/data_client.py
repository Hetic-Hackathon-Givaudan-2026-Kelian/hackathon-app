from typing import Literal

import httpx
from pydantic import BaseModel, Field

from backend.config import settings


class DataApiError(Exception):
    """Exception qui survient lorsqu'un problème avec l'API des data a lieu"""


class Source(BaseModel):
    source_type: str
    source_id: str
    is_synthetic: bool
    text: str
    score: float = Field(..., description="Similarité cosinus (1 = identique)")


class AskRequest(BaseModel):
    question: str = Field(..., min_length=1, description="Question à rechercher")
    top_k: int = Field(
        default=4, ge=1, le=20, description="Nombre de passages à retrouver"
    )
    history: list[dict[str, str]] = Field(
        default_factory=list,
        description="Messages précédents : {'role': 'user' | 'assistant', 'content': ...}",
    )


class AskResponse(BaseModel):
    question: str
    status: Literal["needs_clarification", "recommendations_ready"]
    answer: str
    model: str
    sources: list[Source]


_FAKE_RESPONSE = [
    Source(
        source_type="arome",
        source_id="AR-1042",
        is_synthetic=True,
        text=(
            "Arôme vanille bourbon. Famille : vanillé. Notes : vanille, crème. "
            "Applications : boisson, produit laitier, pâtisserie. Sucrosité : élevée. "
            "Tenue à la chaleur : bonne. Certifications : naturel."
        ),
        score=0.89,
    ),
    Source(
        source_type="arome",
        source_id="AR-2087",
        is_synthetic=True,
        text=(
            "Arôme fraise des bois. Famille : fruité. Notes : fraise, fruits rouges. "
            "Applications : boisson, confiserie. Sucrosité : moyenne. "
            "Tenue à la chaleur : moyenne. Certifications : naturel, halal."
        ),
        score=0.74,
    ),
    Source(
        source_type="arome",
        source_id="AR-3015",
        is_synthetic=True,
        text=(
            "Arôme caramel beurre salé. Famille : caramélisé. Notes : caramel, beurre. "
            "Applications : pâtisserie, produit laitier. Sucrosité : élevée. "
            "Tenue à la chaleur : très bonne. Certifications : aucune."
        ),
        score=0.61,
    ),
]


async def search_sources(question: str, top_k: int = 4) -> list[Source]:
    """Cherche dans le catalogue de l'API data les passages proches de la question.

    Args:
        question: Ce que cherche le client, en texte libre.
        top_k: Nombre maximum de résultats (entre 1 et 20).

    Returns:
        Les sources trouvées, de la plus pertinente à la moins pertinente.

    Raises:
        DataApiError: si l'API data est injoignable, trop lente ou répond en erreur.
    """
    if settings.data_api_fake:
        return _FAKE_RESPONSE[:top_k]

    request = AskRequest(question=question, top_k=top_k)

    try:
        async with httpx.AsyncClient(timeout=settings.data_api_timeout) as client:
            response = await client.post(
                settings.data_api_url + "/search",
                json=request.model_dump(),
            )
            response.raise_for_status()
            sources = [Source.model_validate(source) for source in response.json()]

    except httpx.HTTPError as e:
        raise DataApiError("Une erreur est survenue avec l'API externe") from e

    return sources


async def ask_assistant(
    question: str, history: list[dict[str, str]], top_k: int = 4
) -> AskResponse:
    """Envoie le message du client et l'historique à l'assistant de l'API data.

    Args:
        question: Le dernier message du client.
        history: Les messages précédents, du plus ancien au plus récent.
        top_k: Nombre maximum d'arômes proposés.

    Returns:
        Soit une question pour préciser le besoin (needs_clarification),
        soit des arômes du catalogue (recommendations_ready).

    Raises:
        DataApiError: si l'API data est injoignable, trop lente ou répond en erreur.
    """
    if settings.data_api_fake:
        if len(history) < 4:
            return AskResponse(
                question=question,
                status="needs_clarification",
                answer="Pour quel type de produit cherchez-vous un arôme ?",
                model="factice",
                sources=[],
            )
        return AskResponse(
            question=question,
            status="recommendations_ready",
            answer="Voici les arômes du catalogue qui correspondent à votre besoin.",
            model="factice",
            sources=_FAKE_RESPONSE[:top_k],
        )

    request = AskRequest(question=question, top_k=top_k, history=history)

    try:
        async with httpx.AsyncClient(timeout=settings.data_api_timeout) as client:
            response = await client.post(
                settings.data_api_url + "/ask",
                json=request.model_dump(),
            )
            response.raise_for_status()
            return AskResponse.model_validate(response.json())

    except httpx.HTTPError as e:
        raise DataApiError("Une erreur est survenue avec l'API externe") from e
