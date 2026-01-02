# Installation des dépendances système pour MarkEasy (Arch Linux)

## Dépendances requises

Pour compiler et exécuter MarkEasy sur Arch Linux, vous devez installer les dépendances système suivantes :

```bash
# Mettre à jour le système
sudo pacman -Syu

# Installer les dépendances Tauri
sudo pacman -S webkit2gtk-4.1 base-devel curl wget openssl gtk3 libayatana-appindicator librsvg

# Installer Rust (si non installé)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Installer Node.js et npm (si non installé)
sudo pacman -S nodejs npm
```

## Vérification des dépendances

Vous pouvez vérifier que les dépendances sont installées avec :

```bash
# Vérifier webkit2gtk-4.1
pkg-config --modversion javascriptcoregtk-4.1

# Vérifier Rust
rustc --version

# Vérifier Node.js
node --version
npm --version
```

## Installation du projet

Une fois les dépendances installées :

```bash
cd markeasy/markdeasy
npm install
npm run tauri dev
```

## Dépendances optionnelles pour le packaging

Pour créer des packages (.pkg.tar.zst, .AppImage) :

```bash
# Pour AppImage
sudo pacman -S fuse2

# Pour la génération d'icônes
sudo pacman -S imagemagick
```

## Problèmes courants

### Erreur : "javascriptcoregtk-4.1" not found

```bash
sudo pacman -S webkit2gtk-4.1
```

### Erreur : PKG_CONFIG_PATH

Si pkg-config ne trouve pas les bibliothèques :

```bash
export PKG_CONFIG_PATH=/usr/lib/pkgconfig:/usr/share/pkgconfig
```

### Erreur de compilation Rust

Mettez à jour Rust :

```bash
rustup update
```

---

Pour plus d'informations, consultez la [documentation Tauri](https://tauri.app/start/prerequisites/).
