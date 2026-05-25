# Moveo — API REST

API Node.js 20 + Express + **MongoDB** (Mongoose) — backend du MVP Moveo Group.

## Prérequis

- Node.js ≥ 20
- MongoDB ≥ 6 local **ou** une URI MongoDB Atlas (gratuit)

## Démarrage local

```bash
# 1. Variables d'environnement
cp .env.example .env
# remplir MONGODB_URI, JWT_*_SECRET, SENDGRID_API_KEY…

# 2. Dépendances
npm install

# 3. Lancer en dev (connexion MongoDB automatique au démarrage)
npm run dev
# → http://localhost:4000
```

Healthcheck : `GET /health`

> Pas de migration manuelle — Mongoose crée automatiquement les collections
> et indexes au premier démarrage.

## Endpoints — préfixe `/api/v1`

| Méthode | Route                       | Auth | Description                              |
| ------- | --------------------------- | :--: | ---------------------------------------- |
| POST    | `/auth/register`            |  —   | Inscription → tokens                     |
| POST    | `/auth/login`               |  —   | Connexion → tokens                       |
| POST    | `/auth/refresh`             |  —   | Renouvelle l'access token                |
| POST    | `/bookings/estimate`        |  —   | Estimation tarifaire (4 véhicules)       |
| POST    | `/bookings`                 |  ✓   | Crée une réservation + email             |
| GET     | `/bookings`                 |  ✓   | Historique du client connecté            |
| PATCH   | `/bookings/:id/cancel`      |  ✓   | Annule une réservation                   |
| GET     | `/users/me`                 |  ✓   | Profil du client connecté                |
| PATCH   | `/users/me`                 |  ✓   | Modifie `firstName` / `phone`            |

## Sécurité

- Mots de passe : `bcryptjs` (10 rounds)
- JWT : access 15 min · refresh 7 jours
- Headers HTTP durcis via `helmet`
- Schémas d'entrée validés par `zod` sur chaque route

## Déploiement

Compatible Railway.app / Render.com / Fly.io + **MongoDB Atlas** (gratuit 512 Mo).  
Définir `MONGODB_URI` (URI Atlas) + secrets JWT en variables d'environnement.
