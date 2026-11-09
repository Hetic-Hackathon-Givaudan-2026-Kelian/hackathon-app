# ADR 0001 — Choix de la pile technique

- **Statut** : accepté
- **Date** : 09/11/2026
- **Décideur** : Kelian Halleray (tech lead)

## Contexte

Le projet est un assistant conversationnel, à la manière d'un Akinator, qui aide un client Givaudan à préciser son besoin aromatique par une série de questions bien choisies. Objectif : arriver à un brief clair dès le premier échange, et réduire les itérations dues à un cahier des charges flou.

Contraintes :
- **4 jours** pour livrer une démo, avec **un seul développeur**
- une équipe avec des profils **data / IA** (Python) et **product**
- un agent capable d'**appeler des outils** (base de profils, algorithme de choix de question), pas un simple chatbot
- des **données clients sensibles** chez Givaudan : il faut pouvoir faire tourner le modèle sans que les données sortent
- le thème du challenge : IA générative, approche agentique, vibe coding

## Décision

| Brique | Choix |
|---|---|
| Back | Python 3.12 + **FastAPI** |
| Agent | **Pydantic AI**, derrière une interface `AgentPort` (architecture hexagonale) |
| Modèle | **Qwen 3.5 (4B) via Ollama** en local par défaut, **Mistral** par API en secours |
| Échange avec le front | Streaming **SSE** (les étapes de l'agent s'affichent en direct) |
| Front | **React + Vite** (TypeScript) |
| Données | Fichiers JSON/CSV dans `ia/data/` |
| Environnement | **Devcontainer** (Python, Node, uv) commun à toute l'équipe |
| Dépendances Python | **uv** |

## Alternatives écartées

- **Java + Spring Boot + Spring AI** : stack maîtrisée par le tech lead, mais plus lourde à monter en 4 jours, et l'écosystème IA a un temps de retard sur Python. Les data ne pourraient ni lire ni proposer de code.
- **Next.js + Vercel AI SDK** : le plus rapide à déployer, mais en TypeScript, donc inaccessible à l'équipe data.
- **LangGraph** : plus puissant pour des flux complexes, mais plus long à prendre en main. Pydantic AI suffit pour un agent avec quelques outils.
- **Modèle uniquement par API (OpenAI, Anthropic)** : payant, et les données sortent de l'entreprise.

## Conséquences

**Positives**
- Toute l'équipe travaille en **Python** : les data peuvent écrire la logique des outils (base de profils, algorithme de choix de question) et proposer des PR.
- **Changer de modèle** se fait dans le `.env`, sans toucher au code.
- **Changer de framework d'agent** ne touche qu'un adaptateur : la route, le front et les outils ne bougent pas.
- Le modèle peut tourner **entièrement en local**
- Installation en une étape grâce au devcontainer, lancement en une commande (`bash dev.sh`).

**Négatives / risques**
- Un **petit modèle local** (4B) se trompe plus souvent d'outil qu'un gros modèle. Mitigation : bascule possible sur Mistral, ou sur Qwen 9B.
- Chaque membre de l'équipe doit **installer Ollama** sur sa machine.
- Le back lit des fichiers hors de son dossier (`ia/`) : à copier dans l'image le jour du déploiement.
- Le tech lead découvre FastAPI et Pydantic AI pendant le projet.