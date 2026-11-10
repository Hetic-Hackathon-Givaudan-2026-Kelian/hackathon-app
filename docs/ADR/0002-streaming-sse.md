# ADR 0002 — Échange front / back en flux SSE

- **Statut** : accepté
- **Date** : 10/11/2026
- **Décideur** : Kelian Halleray (tech lead)
- **Composant** : communication front (React) / back (FastAPI)

## Contexte

L'agent met plusieurs secondes à répondre et appelle des outils en chemin.
Le front doit afficher la réponse au fur et à mesure et mettre à jour la fiche quand un outil répond.

## Options envisagées

| Option | Pour | Contre |
|---|---|---|
| JSON classique | Le plus simple | Écran figé jusqu'à la fin |
| WebSocket | Deux sens | Plus de code, inutile ici |
| **SSE** | Flux sur une simple requête HTTP, natif FastAPI | Un seul sens (suffisant) |

## Décision

`POST /chat` reçoit `{ message, history }` et renvoie un flux `text/event-stream`.
Événements typés dans `agent/events.py` : `text`, `tool_call`, `tool_result`, `done`, `error`.
Le back ne garde pas d'état : le front renvoie l'historique à chaque message.

## Conséquences

- **+** Réponse affichée en direct ; back sans session ; le front ne dépend pas du moteur d'agent.
- **−** L'historique voyage à chaque message ; `/docs` décrit mal le SSE (voir ADR 0003).