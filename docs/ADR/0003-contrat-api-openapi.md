# ADR 0003 — Contrat d'API dans `openapi.yaml`

- **Statut** : accepté
- **Date** : 10/11/2026
- **Décideur** : Kelian Halleray (tech lead)

## Contexte

Le front et l'équipe Data / IA ont besoin de connaître le format de l'API.
FastAPI génère une doc sur `/docs`, mais il faut que le back tourne pour la voir, et elle décrit mal le flux SSE de `/chat`.

## Décision

On écrit le contrat à la main dans [`openapi.yaml`](../../openapi.yaml), à la racine du dépôt (OpenAPI 3.1).
Il décrit `GET /health` et `POST /chat` avec ses 5 types d'événements.

Quand une PR modifie une route, elle met aussi à jour `openapi.yaml`.
Si le changement casse le format, on prévient l'autre équipe avant de fusionner.
Le contrat de l'API de l'équipe data est copié dans [`ia/contrat-api.json`](../../ia/contrat-api.json).
Le back s'appuie sur cette version. Si leur API change, l'équipe data met à jour ce fichier par une PR.

## Conséquences

- Le front et les data peuvent lire le contrat sans lancer le back, et ses changements apparaissent dans l'historique Git.
- Le fichier peut prendre du retard sur le code. On le vérifie en relecture de PR ; un test automatique pourra être ajouté en V1.