# AGENTS.md

Consignes pour les agents de code (Claude Code, Copilot, Cursor, Codex…) sur ce dépôt.

## Règle n°1 : suggérer, ne pas écrire

**Ne modifie aucun fichier de code.** Le code est écrit par le tech lead.
Ton rôle : expliquer, relire, proposer des pistes et signaler les problèmes.
Un extrait court pour illustrer une idée est accepté ; une implémentation complète, non.

## Le projet

Assistant de commande d'arômes pour le Givaudan AI Challenge (équipe Peanuts).
Le client décrit son besoin, l'assistant le guide par des questions jusqu'à une référence du catalogue,
puis l'aide à faire sa demande.
**L'assistant n'invente jamais de prix, de délai ou de compatibilité.**

## Repères

- Back : Python 3.12, FastAPI, Pydantic AI, uv (`backend/`) — Front : React + Vite (`frontend/`)
- Lancer : `bash dev.sh`
- Architecture hexagonale : Pydantic AI n'est importé que dans `agent/adapters/`
- Contrat d'API : `openapi.yaml` — Décisions : `docs/ADR/`
- Ne jamais lire ni proposer de committer un `.env` ou une clé
- Branches : une branche par ticket, PR vers `develop` ; `main` ne reçoit que les livraisons