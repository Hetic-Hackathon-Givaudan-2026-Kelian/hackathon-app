#!/bin/bash

install_uv() {
    if ! command -v uv &> /dev/null; then
        echo "Installation de uv..."
        python3 -m pip install uv || return 1
    else
        echo "uv est déjà installé"
    fi
}

install_back_dependencies() {
    if [ -f "./backend/pyproject.toml" ]; then
        echo "Installation des dépendances backend..."

        (
            cd ./backend || exit 1
            uv sync
        ) || return 1

        echo "Dépendances backend installées avec succès"
    else
        echo "Pas de backend/pyproject.toml, installation backend ignorée"
        return 0
    fi
}

install_front_dependencies() {
    if [ -f "./frontend/package.json" ]; then
        echo "Installation des dépendances frontend..."

        (
            cd ./frontend || exit 1
            npm install
        ) || return 1

        echo "Dépendances frontend installées avec succès"
    else 
        echo "Pas de frontend/package.json, installation frontend ignorée"
        return 0
    fi
}

install_uv || exit 1
install_back_dependencies || exit 1
install_front_dependencies || exit 1