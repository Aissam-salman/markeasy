# Guide: Intégrer MarkEasy dans vos dotfiles

## Structure recommandée dans vos dotfiles

```
~/dotfiles/
├── packages/
│   └── markeasy/
│       ├── PKGBUILD        # Lien symbolique ou copie
│       └── .SRCINFO        # Lien symbolique ou copie
└── scripts/
    └── install-packages.sh # Script d'installation automatique
```

## Option 1: Lien symbolique (recommandé)

Créez des liens symboliques depuis votre dépôt dotfiles vers le projet:

```bash
# Dans votre dossier dotfiles
mkdir -p ~/dotfiles/packages/markeasy
cd ~/dotfiles/packages/markeasy

# Créer des liens symboliques
ln -s ~/Work/LAB/markeasy/PKGBUILD .
ln -s ~/Work/LAB/markeasy/.SRCINFO .
ln -s ~/Work/LAB/markeasy/install-arch.sh .

# Commit dans git
git add -f PKGBUILD .SRCINFO install-arch.sh
git commit -m "Add MarkEasy package"
```

## Option 2: Copier les fichiers

```bash
# Copier les fichiers dans dotfiles
mkdir -p ~/dotfiles/packages/markeasy
cp ~/Work/LAB/markeasy/PKGBUILD ~/dotfiles/packages/markeasy/
cp ~/Work/LAB/markeasy/.SRCINFO ~/dotfiles/packages/markeasy/
cp ~/Work/LAB/markeasy/install-arch.sh ~/dotfiles/packages/markeasy/

cd ~/dotfiles
git add packages/markeasy
git commit -m "Add MarkEasy package"
```

## Installation depuis vos dotfiles

### Sur une nouvelle machine:

```bash
# Cloner vos dotfiles
git clone https://github.com/votre-username/dotfiles.git ~/dotfiles

# Installer MarkEasy
cd ~/dotfiles/packages/markeasy
chmod +x install-arch.sh
./install-arch.sh
```

### Mise à jour manuelle:

```bash
cd ~/dotfiles/packages/markeasy
makepkg -si
```

## Script d'installation automatique pour tous vos packages

Créez `~/dotfiles/scripts/install-packages.sh`:

```bash
#!/bin/bash
# Installation automatique de tous les packages AUR/locaux

set -e

DOTFILES_DIR="$HOME/dotfiles"
PACKAGES_DIR="$DOTFILES_DIR/packages"

echo "🚀 Installation des packages personnalisés..."

for pkg_dir in "$PACKAGES_DIR"/*; do
    if [ -d "$pkg_dir" ] && [ -f "$pkg_dir/PKGBUILD" ]; then
        pkg_name=$(basename "$pkg_dir")
        echo "📦 Installation de $pkg_name..."
        cd "$pkg_dir"
        makepkg -si --noconfirm --needed
    fi
done

echo "✅ Tous les packages ont été installés!"
```

## Publier sur AUR (optionnel)

Si vous voulez partager MarkEasy sur AUR:

```bash
# Cloner le dépôt AUR
git clone ssh://aur@aur.archlinux.org/markeasy-git.git
cd markeasy-git

# Copier les fichiers
cp ~/Work/LAB/markeasy/PKGBUILD .
cp ~/Work/LAB/markeasy/.SRCINFO .

# Mettre à jour .SRCINFO
makepkg --printsrcinfo > .SRCINFO

# Publier
git add PKGBUILD .SRCINFO
git commit -m "Initial commit / Update to version X.Y.Z"
git push
```

## Maintenance

### Mettre à jour la version:

1. Modifier la version dans `package.json` et `src-tauri/tauri.conf.json`
2. Mettre à jour `pkgver` dans PKGBUILD
3. Incrémenter `pkgrel` ou le remettre à 1 si `pkgver` change
4. Régénérer .SRCINFO: `makepkg --printsrcinfo > .SRCINFO`
5. Tester: `makepkg -si`
6. Commit et push dans vos dotfiles

### Synchroniser avec vos dotfiles:

```bash
# Si vous utilisez des liens symboliques, rien à faire!
# Si vous copiez les fichiers:
cp ~/Work/LAB/markeasy/PKGBUILD ~/dotfiles/packages/markeasy/
cp ~/Work/LAB/markeasy/.SRCINFO ~/dotfiles/packages/markeasy/
cd ~/dotfiles && git add -A && git commit -m "Update MarkEasy"
```

## Tips

- Ajoutez `/pkg/` et `/src/` dans le `.gitignore` du dossier packages
- Utilisez `makepkg -f` pour forcer la reconstruction
- Pour nettoyer: `makepkg -c` ou `rm -rf pkg/ src/`
- Vérifiez les erreurs: `namcap PKGBUILD` et `namcap *.pkg.tar.zst`
