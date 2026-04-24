# 🌌 StudentMarket : Édition Neo-Digitalism

[![Déployer sur Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FeibaRRR%2Fstudent-market)

**StudentMarket** est une plateforme de vente entre étudiants de nouvelle génération. Arborant une esthétique **Neo-Digitalism** futuriste, elle fusionne un design "Glassmorphism" épuré avec des fonctionnalités avancées comme l'essayage virtuel en AR et la cartographie réelle des zones de sécurité du campus.

---

## ✨ Fonctionnalités Clés

### 🛍️ Marketplace Intelligente
- **Catalogue Dynamique** : Parcourez les annonces (vêtements, livres, électronique) avec une interface fluide.
- **Pulse Ticker** : Un bandeau défilant en temps réel affichant les tendances du marché, les baisses de prix et les dernières ventes.
- **Filtrage Avancé** : Recherche par catégorie, état de l'objet et gamme de prix.

### 👓 Essayage Virtuel AR (Simulé)
- **Interface HUD** : Simulez le scan d'un vêtement avec une interface de Réalité Augmentée futuriste.
- **Analyse de Matière** : Animations de scan 3D et overlays de données pour visualiser les détails avant l'achat.
- **Achat Instantané** : Redirection automatique vers le chat avec un message pré-rempli sur la disponibilité du produit.

### 📍 Campus Radar (Safe Zones)
- **Carte Réelle de Tanger** : Vue satellite nocturne réelle de Tanger montrant les points d'échange sécurisés.
- **Indicateurs de Sécurité** : Points d'intérêt (FST, City Center, etc.) avec niveaux de sécurité et temps de marche calculés.
- **Interface Géo-Contextuelle** : Bulles d'informations interactives pour des transactions en toute sérénité.

### 🏆 Karma Digital & Profil
- **Système de Réputation** : Gagnez de l'XP ("Digital Karma") via vos ventes et les évaluations positives.
- **Badges Mythiques** : Débloquez des badges rares (Commun, Rare, Mythique) affichés fièrement sur votre profil.
- **Gestion de Profil Avancée** :
  - **Import Local** : Changez votre photo de profil en important une image directement depuis votre appareil (Base64).
  - **Pop-ups Stylées** : Modifiez votre nom et votre email via des fenêtres modales au design Neo-Digitalism (plus de prompts navigateur basiques).

### 💬 Messagerie & IA
- **MIGO (My Intelligent Guide & Observer)** : Assistant IA intégré (Mistral AI) pour guider les utilisateurs.
- **Chat P2P** : Communication directe et sécurisée entre acheteurs et vendeurs.

---

## 🚀 Stack Technique

- **Cœur** : [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Design** : [Tailwind CSS](https://tailwindcss.com/) avec un système de design personnalisé (Glassmorphism).
- **Stockage** : Persistance réactive via `localStorage` pour une expérience sans serveur (Serverless-ready).
- **Déploiement** : Optimisé pour [Vercel](https://vercel.com/).
- **Intelligence Artificielle** : Intégration des modèles GitHub (Mistral AI).

---

## 🛠️ Installation et Configuration

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/eibaRRR/student-market.git
   cd student-market
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   Créez un fichier `.env.local` à la racine :
   ```text
   VITE_GITHUB_TOKEN=votre_token_github_personnel
   ```

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

---

## 📦 Déploiement sur Vercel

Le projet est pré-configuré pour un déploiement en un clic :
1. Poussez votre code sur GitHub.
2. Importez le projet sur le tableau de bord Vercel.
3. Ajoutez la variable d'environnement `VITE_GITHUB_TOKEN` dans les réglages Vercel.
4. Déployez !

---

## 🎨 Philosophie de Design : Neo-Digitalism
L'interface repose sur un fond **Dark Mesh**, des composants en **verre poli** (Glassmorphism) et des accents **Cyan/Émeraude**. L'objectif est de transformer l'échange universitaire en une expérience premium, sécurisée et technologiquement inspirante.

---

## 📝 Licence
Distribué sous licence MIT.

Développé avec 💜 pour la communauté étudiante de Tanger.
