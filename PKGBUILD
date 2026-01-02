# Maintainer: Votre Nom <votre@email.com>
pkgname=markeasy-git
pkgver=0.1.0
pkgrel=1
pkgdesc="Un éditeur Markdown moderne avec prévisualisation en temps réel (Tauri)"
arch=('x86_64')
url="https://github.com/votre-username/markeasy"
license=('MIT')
depends=('webkit2gtk-4.1' 'gtk3' 'libayatana-appindicator' 'librsvg')
makedepends=('rust' 'cargo' 'nodejs' 'npm')
provides=('markeasy')
conflicts=('markeasy')
_srcdir="$HOME/Work/LAB/markeasy"

build() {
  cd "$_srcdir"

  # Installer les dépendances npm
  npm install

  # Installer Tauri CLI si nécessaire
  if ! command -v cargo-tauri &> /dev/null; then
    cargo install tauri-cli
  fi

  # Build avec Tauri (qui build automatiquement le frontend et le backend)
  npm run tauri:build
}

package() {
  cd "$_srcdir"

  # Installer le binaire
  install -Dm755 "src-tauri/target/release/markdeasy" "$pkgdir/usr/bin/markdeasy"

  # Installer les icônes
  for size in 32 128; do
    install -Dm644 "src-tauri/icons/${size}x${size}.png" \
      "$pkgdir/usr/share/icons/hicolor/${size}x${size}/apps/markdeasy.png"
  done

  # Créer le fichier .desktop
  install -Dm644 /dev/stdin "$pkgdir/usr/share/applications/markdeasy.desktop" <<EOF
[Desktop Entry]
Name=MarkEasy
Comment=Éditeur Markdown avec prévisualisation en temps réel
Exec=markdeasy
Icon=markdeasy
Type=Application
Categories=Office;TextEditor;Development;
Terminal=false
Keywords=markdown;editor;preview;
EOF

  # Installer la documentation
  install -Dm644 "README.md" "$pkgdir/usr/share/doc/markdeasy/README.md"
  install -Dm644 "INSTALL_ARCH.md" "$pkgdir/usr/share/doc/markdeasy/INSTALL_ARCH.md"
}
