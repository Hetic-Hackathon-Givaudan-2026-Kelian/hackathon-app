# Givaudan AI Challenge — Squelette

Socle d'agent IA prêt à l'emploi : on branche l'idée en ajoutant des **outils** et un **prompt**, le reste ne bouge pas.

**Stack** : FastAPI + PydanticAI · React + Vite · Qwen (Ollama) ou Mistral

## Lancer

1. Installer [Ollama](https://ollama.com/download), puis sur ta machine : `ollama pull qwen3.5:4b`
2. Ouvrir le repo dans VS Code → **Reopen in Container**
3. `bash dev.sh` → http://localhost:5173

## Structure

```
ia/prompts/system.md        → le comportement de l'agent
ia/data/                    → les fausses données
backend/src/backend/
  tools/                    → les outils de l'agent
  services/                 → les faux systèmes (SAP…)
  agent/                    → interface + adaptateur PydanticAI
  api/                      → la route POST /chat (streaming)
frontend/                   → l'interface de chat
```

## Brancher une idée

- **Changer le comportement** → modifier `ia/prompts/system.md`
- **Ajouter un outil** → une fonction avec une docstring dans `tools/`, puis l'ajouter à `ALL_TOOLS`
- **Changer de modèle** → `LLM_PROVIDER` et `LLM_MODEL` dans `backend/.env`

## Règles

- Jamais de push sur `main` : branche + Pull Request
- Commits : `feat:` `fix:` `docs:` `chore:` `refactor:`
- Le `.env` ne se commit pas