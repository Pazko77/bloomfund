# 🌸 BloomFund - Crowdfunding Écologique Local 

**BloomFund** est une plateforme de financement participatif dédiée aux initiatives écologiques de proximité (jardins partagés, composts collectifs, rénovations éco). Ce projet a été développé sur la base d'un cahier des charges strict (SAE 5.01) visant à favoriser la démocratie locale et la transparence financière.

## 📋 Enjeux & Problématique
Comment permettre aux citoyens de soutenir facilement des projets écologiques locaux avec un suivi transparent de leur impact ?
BloomFund répond à ce besoin en offrant une interface simple entre citoyens et porteurs de projets.

## ✨ Fonctionnalités Implémentées
* **Gestion Multi-acteurs :** Espaces dédiés pour les Citoyens (donateurs) et les Associations (porteurs de projets).
* **Système de Vote :** Mise en avant communautaire des initiatives les plus prometteuses.
* **Tableau de Bord :** Suivi en temps réel de la progression du financement et des indicateurs d'impact.
* **Contributions Simulées :** Gestion complète du flux de don (hors paiements réels).

## 🛠 Contraintes Techniques Respectées
* **Stack :** Frontend React/TS, Backend Node.js/Express, Base de données relationnelle.
* **Qualité :** Temps de réponse < 2s, respect des principes d'UX Design (Figma) et conformité RGPD.

---
## Lien
* **Déploiement :** https://bloomfund-frontend.vercel.app
* **Maquette :** https://www.figma.com/design/xkkQ4iT5xB8ewacQZGSxwe/Financement-participative?node-id=10-21&t=8g9idOour2vmwys9-1

## Prérequis

BloomFund est un projet full-stack avec un **frontend** et un **backend** séparés. Ce projet utilise `npm` pour gérer les dépendances et `concurrently` pour lancer les deux parties en même temps avec une seule commande.

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (version 18+ recommandée)
- npm (livré avec Node.js)
- Git (pour cloner le projet)

---

## Installation

1. **Cloner le projet :**

```bash
git clone https://github.com/Pazko77/bloomfund.git
cd bloomfund

2. ** Installer toutes les dépendances **

npm install
npm install --prefix frontend
npm install --prefix backend


3. **Lancer le projet**
npm run dev
```
