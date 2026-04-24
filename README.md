# 🌌 StudentMarket : Édition Neo-Digitalism

[![Déployer sur Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FeibaRRR%2Fstudent-market)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**StudentMarket** est une plateforme P2P révolutionnaire conçue pour l'écosystème universitaire. Alliant une esthétique **Neo-Digitalism** immersive et des outils de confiance basés sur l'IA, elle redéfinit la manière dont les étudiants de Tanger échangent leurs ressources.

---

## 💎 Vision & Design : Neo-Digitalism
Le projet repose sur une philosophie de design "Edge Tech" :
- **Dark Mesh Background** : Un fond dynamique avec des gradients profonds pour réduire la fatigue oculaire.
- **Glassmorphism** : Utilisation intensive de surfaces en verre dépoli avec des bordures translucides (`backdrop-blur`).
- **Accent Cyber** : Palette de couleurs Cyan, Émeraude et Violet électrique pour une ambiance technologique.

---

## ✨ Fonctionnalités Avancées en Détail

### 🛍️ Marketplace & Trends
- **Catalogue Intelligent** : Système de rendu dynamique basé sur les composants pour une navigation sans rechargement.
- **Pulse Ticker** : Un système d'alerte en temps réel (Simulation) informant les utilisateurs des baisses de prix critiques et des nouvelles opportunités sur le campus.

### 👓 Essayage Virtuel & AR HUD
Une innovation majeure pour la catégorie Vêtements :
- **Scan d'Objet** : Utilisation de `@keyframes scan-line` pour simuler une analyse 3D en temps réel.
- **HUD (Heads-Up Display)** : Overlay d'informations techniques (matière, taille, état) durant le scan.
- **Conversion Directe** : Si l'utilisateur est satisfait, le bouton "Acheter" génère automatiquement une demande personnalisée dans le chat.

### 📍 Campus Radar (Safe Zones Tanger)
Sécurité avant tout :
- **Cartographie Réelle** : Intégration d'une vue satellite nocturne haute définition de **Tanger**.
- **Points de Rendez-vous** :
  - **FST Tanger** : Point certifié par l'université.
  - **Tanger City Center** : Zone sous vidéo-protection.
  - **Bibliothèque Universitaire** : Zone calme et surveillée.
- **Calcul de Distance** : Estimation du temps de marche depuis la position centrale du campus.

### 🏆 Système de Karma & Gamification
- **XP de Confiance** : Chaque transaction réussie augmente le "Digital Karma".
- **Collection de Badges** : Système de rareté (Commun, Rare, Mythique) pour valoriser les vendeurs sérieux.
- **Profil Dynamique** : Sidebar interactive affichant le niveau d'XP et les succès débloqués.

### 💬 MIGO : Votre Guide Intelligent
- **IA Conversationnelle** : Intégration de **Mistral AI** via l'API Azure Inference.
- **Contexte Étudiant** : MIGO est configuré pour répondre spécifiquement aux besoins du campus et guider les utilisateurs dans l'utilisation de la plateforme.

---

## 🛠️ Architecture Technique

### 📁 Structure du Projet
- **`/src/views`** : Logique de rendu pour chaque page (Home, Catalog, Details, Student, Admin).
- **`/src/store.ts`** : Système de gestion d'état centralisé avec persistance `localStorage`.
- **`/src/components/chatbot.ts`** : Module autonome pour l'intégration de l'IA.
- **`/public`** : Gestion des assets statiques (images satellite, placeholders).

### 🛡️ Sécurité & Performance
- **Variables d'Environnement** : Protection des clés API (`VITE_GITHUB_TOKEN`) via le système de Vite.
- **Optimisation des Images** : Utilisation du format Base64 pour les avatars personnalisés afin d'éliminer les requêtes serveur inutiles.
- **SPA Router** : Routage côté client ultra-rapide pour une expérience fluide comme une application native.

---

## ⚙️ Configuration & Installation

### Pré-requis
- Node.js (v18+)
- npm ou yarn

### Installation
```bash
# 1. Clonage
git clone https://github.com/eibaRRR/student-market.git
cd student-market

# 2. Dépendances
npm install

# 3. Variables d'environnement
# Créer un fichier .env.local
echo "VITE_GITHUB_TOKEN=votre_token_ici" > .env.local

# 4. Lancement
npm run dev
```

---

## 📦 Déploiement Vercel
Le projet inclut un fichier `vercel.json` optimisé pour le routage SPA. Pour déployer :
1. Connectez votre dépôt GitHub à Vercel.
2. Ajoutez la variable `VITE_GITHUB_TOKEN` dans les "Environment Variables".
3. Vercel lancera automatiquement le build `tsc && vite build`.

---

## 🗺️ Roadmap Future
- [ ] Intégration d'une base de données réelle (Supabase/Firebase).
- [ ] Système de paiement sécurisé (Stripe/PayPal).
- [ ] Géolocalisation GPS en temps réel sur le Campus Radar.

---

## 📝 Auteur
Développé par **eibaRRR** avec une vision pour l'innovation étudiante à Tanger.
