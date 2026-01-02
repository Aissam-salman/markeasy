# MarkEasy

Un éditeur Markdown moderne et léger pour Linux, inspiré de Typora, construit avec Tauri, React et TypeScript.

## 🚀 Fonctionnalités

- ✨ **Éditeur Markdown** avec coloration syntaxique (CodeMirror 6)
- 👁️ **Prévisualisation en temps réel** avec rendu sécurisé
- 🎨 **Thèmes clair et sombre** avec basculement facile
- 📱 **Trois modes d'affichage** : Source, Hybride (split), Prévisualisation
- 💾 **Gestion de fichiers** complète (ouvrir, sauvegarder, nouveau)
- ⌨️ **Raccourcis clavier** intuitifs
- 📊 **Statistiques en temps réel** (lignes, mots, caractères)
- 🔒 **Sécurisé** avec sanitization HTML via DOMPurify
- ⚡ **Performant** grâce à Tauri (< 10 MB)

## 📋 Prérequis

### Dépendances système (Arch Linux)

```bash
sudo pacman -Syu
sudo pacman -S webkit2gtk base-devel curl wget openssl gtk3 libayatana-appindicator librsvg
```

### Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### Node.js et npm

```bash
sudo pacman -S nodejs npm
```

## 🛠️ Installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd markeasy/markdeasy
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer en mode développement**
   ```bash
   npm run tauri dev
   ```

4. **Build de production**
   ```bash
   npm run tauri build
   ```

Le binaire sera généré dans `src-tauri/target/release/`.

## ⌨️ Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `Ctrl+N` | Nouveau fichier |
| `Ctrl+O` | Ouvrir un fichier |
| `Ctrl+S` | Sauvegarder |
| `Ctrl+Shift+S` | Sauvegarder sous |
| `Ctrl+/` | Basculer entre les modes d'affichage |

## 🎨 Modes d'affichage

1. **Mode Source** : Éditeur brut avec coloration syntaxique Markdown
2. **Mode Hybride** : Éditeur à gauche + Prévisualisation à droite (split 50/50)
3. **Mode Prévisualisation** : Uniquement le rendu (lecture seule)

## 🏗️ Architecture

```
src/
├── components/
│   ├── Editor/          # Éditeur CodeMirror
│   ├── Preview/         # Prévisualisation Markdown
│   └── Layout/          # Header, StatusBar
├── hooks/               # Hooks React personnalisés
├── store/               # Gestion d'état Zustand
├── utils/               # Utilitaires (markdown, etc.)
└── styles/              # Styles CSS

src-tauri/
└── src/                 # Code Rust (backend)
```

## 🛠️ Stack technique

- **Frontend** : React 18 + TypeScript
- **Éditeur** : CodeMirror 6
- **Rendu Markdown** : marked + DOMPurify
- **Styling** : Tailwind CSS
- **État** : Zustand
- **Backend** : Tauri 2.0 (Rust)
- **Build** : Vite

## 📦 Dépendances principales

```json
{
  "@uiw/react-codemirror": "Éditeur de code",
  "@codemirror/lang-markdown": "Support Markdown",
  "marked": "Parser Markdown",
  "dompurify": "Sanitization HTML",
  "zustand": "Gestion d'état",
  "lucide-react": "Icônes",
  "tailwindcss": "Styles CSS",
  "@tauri-apps/api": "API Tauri",
  "@tauri-apps/plugin-dialog": "Dialogues natifs",
  "@tauri-apps/plugin-fs": "Système de fichiers"
}
```

## 🎯 Roadmap

- [x] Éditeur Markdown avec coloration syntaxique
- [x] Prévisualisation en temps réel
- [x] Gestion de fichiers (ouvrir/sauvegarder)
- [x] Thèmes clair et sombre
- [x] Trois modes d'affichage
- [x] Raccourcis clavier
- [ ] Support des raccourcis Vim
- [ ] Export PDF
- [ ] Export HTML
- [ ] Support diagrammes Mermaid
- [ ] Support formules mathématiques (KaTeX)
- [ ] Mode Focus/Plein écran
- [ ] Historique des fichiers récents
- [ ] Auto-sauvegarde
- [ ] Rechercher et remplacer

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 💡 Inspiration

Ce projet est inspiré par [Typora](https://typora.io/), mais avec un focus sur :
- Open source et gratuit
- Performances accrues (Tauri vs Electron)
- Optimisé pour Linux
- Extensible et personnalisable

---

**Fait avec ❤️ en utilisant Tauri, React et TypeScript**
