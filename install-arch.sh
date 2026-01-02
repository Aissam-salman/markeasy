#!/bin/bash
# Script d'installation de MarkEasy pour Arch Linux

set -e

echo "🚀 Installation de MarkEasy..."

# Vérifier les dépendances
echo "📦 Vérification des dépendances système..."
MISSING_DEPS=()

for pkg in webkit2gtk-4.1 gtk3 libayatana-appindicator librsvg rust nodejs npm; do
    if ! pacman -Qi "$pkg" &> /dev/null; then
        MISSING_DEPS+=("$pkg")
    fi
done

if [ ${#MISSING_DEPS[@]} -ne 0 ]; then
    echo "⚠️  Dépendances manquantes: ${MISSING_DEPS[*]}"
    echo "Installation des dépendances..."
    sudo pacman -S --needed "${MISSING_DEPS[@]}"
fi

# Construire le package
echo "🔨 Construction du package..."
makepkg -si --noconfirm

echo "✅ MarkEasy a été installé avec succès!"
echo "Vous pouvez le lancer avec: markdeasy"
