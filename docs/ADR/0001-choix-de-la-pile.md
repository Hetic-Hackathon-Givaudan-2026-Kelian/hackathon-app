# ADR 0001 — Choix de la pile technique

- **Statut** : accepté
- **Date** : 09/11/2026
- **Décideur** : Kelian Halleray (tech lead)

## Contexte

Assistant conversationnel qui guide un client par des questions jusqu'au bon arôme.
Contraintes : 4 jours, un seul développeur, une équipe data en Python, un agent qui appelle des outils,
et des données qui doivent pouvoir rester en local.

## Décision

| Brique | Choix |
|---|---|
| Back | Python 3.12, FastAPI, uv |
| Agent | Pydantic AI derrière l'interface `AgentPort` (hexagonal) |
| Modèle | Qwen 3.5 4B via Ollama (local), Mistral en secours |
| Front | React + Vite, échange en SSE |
| Catalogue | API de l'équipe data (`ia/data/` pour les fausses données de test) |
| Environnement | Devcontainer commun |

## Alternatives écartées

- **Java / Spring AI** : trop lourd en 4 jours, illisible pour les data.
- **Next.js** : TypeScript, inaccessible aux data.
- **LangGraph** : trop long à prendre en main pour quelques outils.
- **API seule (OpenAI…)** : payante, données hors de l'entreprise.

## Conséquences

- **+** Toute l'équipe en Python ; modèle changeable dans le `.env` ; moteur d'agent remplaçable via un adaptateur.
- **−** Un modèle 4B se trompe plus souvent (secours : Mistral) ; Ollama à installer sur chaque poste.