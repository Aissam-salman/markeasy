# Maintainer: Salman <votre@email.com>
pkgname=markdeasy
pkgver=0.1.0
pkgrel=1
pkgdesc="Un éditeur Markdown moderne avec prévisualisation en temps réel (Tauri)"
arch=('x86_64')
url="https://github.com/Aissam-salman/markeasy"
license=('MIT')
depends=('webkit2gtk-4.1' 'gtk3' 'libayatana-appindicator' 'librsvg' 'gcc-libs' 'glibc')
makedepends=('cargo' 'nodejs' 'npm')
provides=('markdeasy')
conflicts=('markdeasy')
source=("git+file://$HOME/Work/LAB/markeasy")
sha256sums=('SKIP')

prepare() {
    cd "$srcdir/markeasy"

    export RUSTUP_TOOLCHAIN=stable
    export CARGO_HOME="$srcdir/cargo-home"

    # Installer les dépendances npm
    npm install

    # Fetch cargo dependencies
    cd src-tauri
    cargo fetch --locked --target "$(rustc -vV | sed -n 's/host: //p')"
}

build() {
    cd "$srcdir/markeasy"

    export RUSTUP_TOOLCHAIN=stable
    export CARGO_HOME="$srcdir/cargo-home"
    export CARGO_TARGET_DIR=target

    # Build le frontend
    npm run build

    # Modifier temporairement tauri.conf.json pour forcer le mode production
    # Sauvegarder l'original
    cp src-tauri/tauri.conf.json src-tauri/tauri.conf.json.bak

    # Supprimer devUrl pour forcer l'utilisation de frontendDist
    sed -i '/"devUrl":/d' src-tauri/tauri.conf.json
    sed -i '/"beforeDevCommand":/d' src-tauri/tauri.conf.json

    # Build le backend Tauri
    cd src-tauri
    cargo build --frozen --release --all-features

    # Restaurer le fichier original
    mv tauri.conf.json.bak tauri.conf.json

package() {
    cd "$srcdir/markeasy"

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
