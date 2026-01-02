#!/bin/bash

# Script de vérification des dépendances pour MarkEasy (Arch Linux)

echo "🔍 Vérification des dépendances pour MarkEasy..."
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

MISSING_DEPS=()

# Vérifier Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} $VERSION"
else
    echo -e "${RED}✗ Non installé${NC}"
    MISSING_DEPS+=("nodejs")
fi

# Vérifier npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} v$VERSION"
else
    echo -e "${RED}✗ Non installé${NC}"
    MISSING_DEPS+=("npm")
fi

# Vérifier Rust
echo -n "Checking Rust... "
if command -v rustc &> /dev/null; then
    VERSION=$(rustc --version | cut -d' ' -f2)
    echo -e "${GREEN}✓${NC} $VERSION"
else
    echo -e "${RED}✗ Non installé${NC}"
    echo -e "${YELLOW}   Installez avec: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh${NC}"
fi

# Vérifier Cargo
echo -n "Checking Cargo... "
if command -v cargo &> /dev/null; then
    VERSION=$(cargo --version | cut -d' ' -f2)
    echo -e "${GREEN}✓${NC} $VERSION"
else
    echo -e "${RED}✗ Non installé${NC}"
fi

# Vérifier pkg-config
echo -n "Checking pkg-config... "
if command -v pkg-config &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Non installé${NC}"
    MISSING_DEPS+=("pkgconf")
fi

# Vérifier webkit2gtk-4.1
echo -n "Checking webkit2gtk-4.1... "
if pkg-config --exists javascriptcoregtk-4.1 2>/dev/null; then
    VERSION=$(pkg-config --modversion javascriptcoregtk-4.1)
    echo -e "${GREEN}✓${NC} $VERSION"
else
    echo -e "${RED}✗ Non installé${NC}"
    MISSING_DEPS+=("webkit2gtk-4.1")
fi

# Vérifier GTK3
echo -n "Checking GTK3... "
if pkg-config --exists gtk+-3.0 2>/dev/null; then
    VERSION=$(pkg-config --modversion gtk+-3.0)
    echo -e "${GREEN}✓${NC} $VERSION"
else
    echo -e "${RED}✗ Non installé${NC}"
    MISSING_DEPS+=("gtk3")
fi

# Vérifier OpenSSL
echo -n "Checking OpenSSL... "
if pkg-config --exists openssl 2>/dev/null; then
    VERSION=$(pkg-config --modversion openssl)
    echo -e "${GREEN}✓${NC} $VERSION"
else
    echo -e "${RED}✗ Non installé${NC}"
    MISSING_DEPS+=("openssl")
fi

# Résumé
echo ""
if [ ${#MISSING_DEPS[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ Toutes les dépendances sont installées !${NC}"
    echo ""
    echo "Vous pouvez maintenant lancer :"
    echo "  npm install"
    echo "  npm run tauri dev"
else
    echo -e "${RED}❌ Dépendances manquantes :${NC}"
    for dep in "${MISSING_DEPS[@]}"; do
        echo "  - $dep"
    done
    echo ""
    echo -e "${YELLOW}Installez les dépendances manquantes avec :${NC}"
    echo "  sudo pacman -S ${MISSING_DEPS[*]}"
fi

echo ""
