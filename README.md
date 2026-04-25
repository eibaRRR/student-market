# 🎓 StudentMarket — La marketplace P2P du campus

> **Neo-Digitalism · Access** — Achetez, vendez et échangez livres, électronique, vêtements et services entre étudiants de Tanger, en toute sécurité et avec une expérience immersive.

StudentMarket est une **Single Page Application** (SPA) écrite en **TypeScript** et propulsée par **Vite + Tailwind CSS**, qui simule une marketplace étudiante complète : annonces, chat, offres, notifications, profils publics, gamification (karma + badges), assistant IA (MIGO), zones de rencontre sécurisées sur carte, et bien plus — le tout sans backend, grâce à une persistance intégrale en `localStorage`.

---

## 📑 Table des matières

1. [Captures](#-captures)
2. [Stack technique](#-stack-technique)
3. [Architecture](#-architecture)
4. [Fonctionnalités détaillées](#-fonctionnalités-détaillées)
5. [Démarrage rapide](#-démarrage-rapide)
6. [Variables d'environnement](#-variables-denvironnement)
7. [Comptes de test pré-configurés](#-comptes-de-test-pré-configurés)
8. [Scripts NPM](#-scripts-npm)
9. [Structure du projet](#-structure-du-projet)
10. [Modèle de données](#-modèle-de-données)
11. [Raccourcis clavier](#-raccourcis-clavier)
12. [Persistance & clés `localStorage`](#-persistance--clés-localstorage)
13. [Accessibilité & responsive](#-accessibilité--responsive)
14. [Déploiement Vercel](#-déploiement-vercel)
15. [Roadmap](#-roadmap)
16. [Licence](#-licence)

---

## 📸 Captures

L'interface adopte un design **Neo-Digitalism** : fond mesh sombre, glassmorphism, palette cyber **Cyan `#00FFFF`**, **Émeraude `#10b981`**, **Violet `#8000FF`**, **Bleu `#0047FF`**, et typographies **Inter** + **Outfit**.

| Vue | Description |
|---|---|
| `home` | Hero plein écran, ticker temps-réel, annonces récentes, "Récemment consultées" |
| `catalog` | Filtres glass, slider de prix double-curseur, grille responsive, états vides |
| `details` | Galerie, méta-infos, bouton vendeur cliquable, **Faire une offre**, **Surveiller**, **Partager**, annonces similaires |
| `user` | Profil public d'un vendeur : karma, badges, distribution de notes, grille d'annonces |
| `student` | Dashboard étudiant : mes annonces, mes favoris, publication, édition |
| `admin` | Modération : utilisateurs, annonces signalées, statistiques, gestion catégories |
| `chat` | Conversations 1:1 entre acheteur et vendeur, contexte d'annonce |
| `auth` | Connexion / Inscription en double colonne, toggle de visibilité du mot de passe |

---

## 🧱 Stack technique

| Couche | Technologie | Rôle |
|---|---|---|
| **Langage** | TypeScript 5 | Typage strict, interfaces, types unions |
| **Bundler** | Vite 5 | Dev server HMR, build production tree-shaké |
| **Styles** | Tailwind CSS 3 + PostCSS + Autoprefixer | Utility-first, dark mode forcé, design system custom |
| **IA conversationnelle** | `@azure-rest/ai-inference` + Mistral via Azure | Assistant **MIGO** (chatbot streaming), avec **fallback offline** si pas de jeton |
| **Charts** | Chart.js 4 | Distribution des notes (rating histogram) sur les profils publics |
| **Persistance** | `localStorage` API (navigateur) | Pas de backend : toutes les données vivent côté client |
| **PWA** | `manifest.webmanifest` | Installable comme application native |
| **Polices** | Google Fonts — Inter & Outfit | Inter pour l'UI, Outfit pour les titres massifs |
| **Hébergement** | Vercel | Déploiement automatique sur push, previews par PR |

---

## 🏗 Architecture

### SPA avec mini-router custom

L'application n'utilise **aucun framework SPA** (React, Vue, Svelte). Elle s'appuie sur un **router maison** dans `src/main.ts` qui :

- Mappe une `currentView` (`home`, `catalog`, `details`, `student`, `admin`, `auth`, `chat`, `user`) à une fonction `render*()` qui retourne du HTML.
- Injecte le HTML dans `<div id="app-container">` puis branche la logique (`setup*Logic`).
- Expose globalement `window.router.navigate(view, params?)` pour les liens cross-vue.
- Protège les routes (`student` et `admin` exigent une session ; `admin` exige `role === 'admin'`).

### Cycle de rendu

```
window.router.navigate('details', { id: 'ad1' })
        │
        ▼
Router.render()  ───►  views/details.ts → renderDetails(params)
        │                          │
        │                          ▼
        │              container.innerHTML = "..."
        │                          │
        │                          ▼
        └────────►   setupDetailsLogic(id)   // listeners
```

### Persistance

`src/store.ts` est l'unique source de vérité. Chaque mutation (création d'annonce, envoi de message, toggle favoris, ajout de notification…) appelle un wrapper `persist*()` qui synchronise `localStorage`. Au reload, les données sont rehydratées via `loadData(key, defaultData)`.

---

## ✨ Fonctionnalités détaillées

### 🔐 Authentification

- **Inscription** (`name`, `email`, `password 6+ caractères`) → auto-login, avatar Pravatar généré.
- **Connexion** par email + mot de passe, toggle œil pour afficher/masquer.
- **Déconnexion** propre avec toast de confirmation.
- Comptes pré-seedés (voir [section dédiée](#-comptes-de-test-pré-configurés)).
- Routes protégées : `student`, `admin`. L'accès anonyme redirige vers `auth`.

### 🛍 Catalogue

- **Filtres en panneau latéral** :
  - Recherche texte temps-réel (titre, description).
  - **Tri** : récentes, populaires, prix ↑, prix ↓, plus convoitées.
  - Catégories cliquables avec emoji (📚 Livres, 💻 Électronique, 👕 Vêtements, 🏠 Logement, 🛠 Services, ✨ Autre).
  - **Slider de prix double-curseur** (`min`/`max`) avec rail de remplissage dynamique et garde-fous (`min ≤ max`).
- Grille responsive avec **skeletons** au chargement, **état vide** explicite, et **compteur live** d'annonces visibles.
- Bouton ❤ favoris en surcouche directement sur les cartes.

### 🔍 Recherche universelle (palette de commandes)

- Ouverture par bouton, **`⌘ K` / `Ctrl K`**, ou simplement **`/`**.
- Tags suggérés : `#Macbook`, `#Ipad Pro`, `#Livres`, `#Tutorat`, `#Vêtements`.
- **`Esc`** pour fermer.

### 📦 Annonces (CRUD complet)

- **Publier** depuis le dashboard ou le FAB central : titre, prix, catégorie, état, image (URL), description, drapeau "service".
- **Éditer** une annonce — déclenche automatiquement une notification de **baisse de prix** aux watchers si `nouveau prix < ancien prix`.
- **Supprimer** avec confirmation modale.
- **Statut cyclique** : `Disponible` → `Réservé` → `Vendu` (via `<select>`).
- **Signaler** une annonce (bascule en `reported`, visible sur le dashboard admin).
- **Compteur de vues** incrémenté à chaque visite de la page détails.

### 💬 Chat 1:1

- Thread par couple (acheteur, vendeur, annonce).
- Bouton **Contacter le vendeur** depuis n'importe quelle annonce.
- Notification automatique au destinataire à chaque nouveau message.
- Aperçu avec image et titre de l'annonce dans l'en-tête de la discussion.

### 💰 Faire une offre

Modale dédiée sur la page détails :
- Suggestion par défaut à **90 % du prix demandé**.
- Hint dynamique selon le ratio offre/prix (ex. "Offre généreuse, le vendeur l'appréciera.").
- À l'envoi :
  1. Crée un message de chat formaté : `💰 Offre proposée : 750,00 € pour "MacBook Pro M1 2020". Êtes-vous intéressé·e ?`
  2. Envoie une notification typée `offer_received` au vendeur.
  3. Redirige l'acheteur vers le thread de chat correspondant.

### 👀 Surveiller (Watcher) + alerte de baisse de prix

- Bouton **Surveiller** ↔ **Surveillé** sur la page détails.
- Au clic : enregistre `(userId, adId, lastSeenPrice)` dans `student-market-watchers`.
- Quand le vendeur édite son annonce et **baisse** le prix, tous les watchers reçoivent une notification de type `price_drop` :
  > **Baisse de prix !** — *MacBook Pro M1 2020 est passé de 850€ à 799€.*
- Cliquer la notification renvoie directement sur la page détails de l'annonce.

### 🔔 Centre de notifications

- Drawer latéral droit (depuis l'icône cloche du sidebar / header mobile).
- **Badge rouge** auto-rafraîchi toutes les 4 secondes avec le compte de notifications non lues.
- Types couverts : `message`, `ad_approved`, `ad_reported`, `price_drop`, `offer_received`, `offer_accepted`, `system`.
- Actions : **Tout lu**, **Vider**, ou clic sur une entrée pour deep-linker vers la vue cible.

### 👤 Profil public d'un vendeur

Cliquer sur le nom du vendeur sur la page détails ouvre un **profil public** dédié contenant :
- Avatar, nom, rôle (`Étudiant·e` / `Admin`), date d'inscription.
- **Karma XP** (avec barre de progression vers le palier 1000).
- **Badges débloqués** (🚀 Pionnier rare, ⚡ Vendeur Éclair mythic, etc.).
- **Note moyenne** + **histogramme de distribution** des étoiles (Chart.js).
- **Grille de toutes les annonces actives ou réservées** du vendeur, cliquables.

### 📤 Partager

- Tente d'abord la **Web Share API** (mobile / iOS / Android).
- **Fallback presse-papier** sur desktop avec toast `Lien copié dans le presse-papier !`.
- URL au format `<origin>/?ad=<adId>` — au prochain reload, le paramètre `?ad=` ouvre directement la page détails.

### 🧠 Mémoire neuronale (Récemment consultées + Annonces similaires)

- **Récemment consultées** sur la home : les 6 dernières annonces visitées, persistées dans `student-market-recent-views`.
- **Annonces similaires** sur la page détails : 4 autres annonces de la même catégorie, hors annonce courante.

### 🎮 Gamification

- **Digital Karma** : points XP gagnés à chaque action (publication, vente conclue, bonne note reçue).
- **Badges** : récompenses débloquables (`Pionnier`, `Vendeur Éclair`, etc.) avec rareté `common`/`rare`/`mythic`.
- **Glow d'avatar** dynamique selon le palier de karma.

### 🗺 Campus Radar (Safe Zones)

Carte satellite zoomable du campus de Tanger (`tangier_satellite_map_dark_*.png`) avec marqueurs des zones validées comme points de rendez-vous sûrs (FST Tanger, City Center, ENSA, etc.).

### 🤖 Assistant MIGO (chatbot IA)

- Activable via le sidebar.
- Streaming via **Azure AI Inference** vers **Mistral** (token côté client : `VITE_AZURE_AI_TOKEN`).
- **Mode dégradé** automatique : si aucun token n'est configuré, MIGO bascule sur des réponses canned et reste utilisable (au lieu de planter l'app).

### 📡 Pulse Ticker

Bandeau d'événements simulés temps réel défilant sur la home (`💻 Macbook Air M1 - Vendu en 15m`, `🔥 Baisse de prix sur "Table de mixage"`, etc.) — donne une impression de vie et d'activité au marché.

### 🛡 Tableau d'administration (`role: admin` uniquement)

- Liste des utilisateurs avec actions (suspendre, bannir, restaurer).
- Liste des annonces signalées (`status: 'reported'`) à modérer.
- Statistiques agrégées : total annonces, annonces actives, total utilisateurs, signalements en attente.
- CRUD des **catégories** (ajouter / supprimer une catégorie globale).

### 📱 Mobile-first

- **Bottom nav** sur viewport < 768px : Home / Catalogue / **+ FAB de publication** centré / MIGO / Profil.
- **Header sticky mobile** avec logo, recherche et cloche de notifications.
- **Sidebar collapsible** sur desktop (réduite à 80px, étendue à 256px au survol).
- Le **Floating Action Menu (Speed Dial)** desktop est **masqué** automatiquement sur mobile pour éviter les FAB en double.

### ♿ Accessibilité

- Tous les boutons interactifs ont un `aria-label` explicite.
- Outlines `focus-visible` sur tabulation clavier.
- Respect de `prefers-reduced-motion` (animations désactivées).
- Contraste AA conservé sur le thème sombre.
- Titres `<h1>/<h2>/<h3>` correctement hiérarchisés pour les lecteurs d'écran.

### 📲 PWA installable

- `public/manifest.webmanifest` complet (`name`, `short_name`, `theme_color`, `background_color`, `icons`).
- Installable comme app autonome sur iOS, Android et desktop Chrome.
- Meta tags **OpenGraph** + **Twitter Card** pour un partage riche sur les réseaux sociaux.

---

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** ≥ 18
- **npm** ≥ 9 (ou `pnpm` / `yarn`)

### Installation

```bash
git clone https://github.com/eibaRRR/student-market.git
cd student-market
npm install
```

### Lancement en développement

```bash
npm run dev
```

L'application est disponible sur **http://localhost:5173** avec **HMR** (Hot Module Replacement). Les modifications de TypeScript, HTML et Tailwind sont reflétées instantanément.

### Build production

```bash
npm run build
```

Génère un bundle optimisé dans `dist/` (tree-shaking, minification, code splitting).

### Prévisualisation locale du build

```bash
npm run preview
```

---

## 🔐 Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
# Token Azure AI Inference pour activer MIGO (le chatbot)
# Sans ce token, MIGO bascule en mode offline (réponses canned).
VITE_AZURE_AI_TOKEN=votre_token_ici
```

> ⚠ **Important** : ne committez **jamais** votre `.env.local`. Il est déjà dans `.gitignore`.

---

## 🧪 Comptes de test pré-configurés

L'application est livrée avec deux utilisateurs et trois annonces seedés au premier démarrage :

| Rôle | Email | Mot de passe | Karma | Badges |
|---|---|---|---|---|
| Étudiant | `thomas@etu.fr` | `password123` | 450 | 🚀 ⚡ |
| Admin | `admin@univ.fr` | `admin` | 1000 | — |

Annonces seedées (toutes appartiennent à Thomas) :

- **MacBook Pro M1 2020** — 850 € — Électronique — Très bon état
- **Sweat Université** — 15 € — Vêtements — Neuf
- **Cours de Soutien Mathématiques** — 20 € — Services — `isService: true`

Pour repartir d'un état vierge, ouvrez la console du navigateur :

```js
localStorage.clear(); location.reload();
```

---

## 📜 Scripts NPM

| Commande | Action |
|---|---|
| `npm run dev` | Serveur de développement Vite avec HMR sur `:5173` |
| `npm run build` | Type-check (`tsc`) puis build production dans `dist/` |
| `npm run preview` | Sert le build production localement pour validation |

---

## 🗂 Structure du projet

```
student-market/
├── index.html                    # Shell HTML : sidebar, header mobile, drawers, FAB
├── public/
│   ├── manifest.webmanifest      # Configuration PWA
│   └── tangier_satellite_map_*.png   # Carte du campus pour le Safe Zone radar
├── src/
│   ├── main.ts                   # Mini-router + bootstrap + listeners globaux
│   ├── store.ts                  # State global + persistance localStorage (475 lignes)
│   ├── types.ts                  # Toutes les interfaces TypeScript
│   ├── utils.ts                  # Helpers : showToast, showConfirm, formatPrice, ...
│   ├── style.css                 # Styles Tailwind + animations custom + thème
│   ├── components.ts             # Composants UI partagés (cartes d'annonces, etc.)
│   ├── components/
│   │   ├── chatbot.ts            # Logique MIGO + appel Azure AI / fallback offline
│   │   └── notifications.ts      # Drawer notifications + badge auto-refresh
│   └── views/
│       ├── home.ts               # Hero, ticker, récemment consultées
│       ├── catalog.ts            # Filtres + grille + slider double-curseur
│       ├── details.ts            # Page annonce + modale offre + watch + similaires
│       ├── student.ts            # Dashboard utilisateur connecté
│       ├── admin.ts              # Tableau de bord administrateur
│       ├── auth.ts               # Connexion / Inscription
│       ├── chat.ts               # Threads de discussion 1:1
│       └── user.ts               # Profil public d'un vendeur
├── tailwind.config.js            # Configuration Tailwind (palette custom, fonts)
├── postcss.config.js             # PostCSS pour Tailwind + Autoprefixer
├── tsconfig.json                 # Configuration TypeScript stricte
├── vite.config.ts                # Vite (implicite)
├── vercel.json                   # Configuration Vercel pour SPA fallback
└── package.json                  # Dépendances et scripts
```

---

## 📐 Modèle de données

### Entités principales

```ts
User {
  id, name, email, avatar, password?
  role: 'student' | 'admin'
  joinDate
  status?: 'active' | 'suspended' | 'banned'
  karma: number
  badges: Badge[]
  ratings?: { fromUserId, score }[]
  favorites?: string[]   // adIds
}

Ad {
  id, title, description, price, imageUrl
  category, condition
  userId        // vendeur
  createdAt
  status: 'active' | 'pending' | 'sold' | 'reported' | 'reserved'
  views, watchingCount?
  isService?: boolean
}

Message {
  id, senderId, receiverId, adId
  content, timestamp
}

AppNotification {
  id, userId
  type: 'message' | 'price_drop' | 'offer_received' | 'offer_accepted' | 'ad_approved' | 'ad_reported' | 'system'
  title, body
  link?: { view: string, params?: object }   // deep-link à l'ouverture
  timestamp, read: boolean
}

AdWatcher {
  userId, adId
  lastSeenPrice
  createdAt
}
```

---

## ⌨ Raccourcis clavier

| Touche | Action |
|---|---|
| `⌘ K` / `Ctrl K` | Ouvrir la palette de recherche |
| `/` | Ouvrir la palette de recherche (sans modifieur) |
| `Esc` | Fermer la palette de recherche / les modales |

---

## 💾 Persistance & clés `localStorage`

| Clé | Contenu |
|---|---|
| `market_users` | Liste des utilisateurs |
| `market_ads` | Liste des annonces |
| `market_messages` | Messages de chat |
| `market_categories` | Catégories globales |
| `market_current_user` | ID utilisateur connecté (session) |
| `student-market-watchers` | Watchers actifs `(userId, adId, lastSeenPrice)` |
| `student-market-notifications` | Notifications in-app par utilisateur |
| `student-market-recent-views` | IDs des annonces récemment consultées |

> Toutes les données vivent **uniquement dans le navigateur**. Vider le `localStorage` revient à réinitialiser l'application.

---

## 📱 Accessibilité & responsive

- **Breakpoint** principal : `md` à 768px (Tailwind par défaut).
- < 768px : header mobile + bottom nav 5 boutons + FAB central de publication.
- ≥ 768px : sidebar collapsible (80px → 256px au survol) + Floating Action Menu speed-dial.
- Toutes les cibles tactiles respectent une taille minimale de 44 × 44 px.
- Navigation entièrement utilisable au clavier avec ordre de tabulation cohérent.

---

## ☁ Déploiement Vercel

Le repo est branché sur Vercel :

- **Production** : déployée automatiquement sur chaque push vers `main`.
- **Preview** : un déploiement par PR, lien posté en commentaire automatique.
- Configuration `vercel.json` minimaliste (rewrite tout vers `index.html` pour la SPA).

Pour configurer votre propre déploiement :

1. Connectez le repo à Vercel via [vercel.com/new](https://vercel.com/new).
2. Build command : `npm run build`
3. Output directory : `dist`
4. Variable d'environnement : `VITE_AZURE_AI_TOKEN` (optionnel, pour MIGO).

---

## 🛣 Roadmap

Améliorations envisagées (non implémentées par défaut) :

- [ ] **Backend réel** (Postgres + Prisma + auth JWT) pour persister les données entre devices.
- [ ] **Paiements** (Stripe / CMI) avec escrow étudiant.
- [ ] **Géolocalisation native** pour le radar des Safe Zones.
- [ ] **Notifications push** (Web Push API).
- [ ] **Modération automatique** des images d'annonces (IA de classification).
- [ ] **Internationalisation** (i18n FR / AR / EN).
- [ ] **Tests E2E** avec Playwright.

---

## 📄 Licence

Ce projet est distribué sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

---

<p align="center">
  Conçu avec ❤ pour les étudiants du campus de Tanger.<br/>
  <strong>StudentMarket</strong> — Débloquez l'économie du campus.
</p>
