# Moveo — API REST

API Node.js 20 + Express + PostgreSQL — backend du MVP Moveo Group.

## Prérequis

- Node.js ≥ 20
- PostgreSQL ≥ 13 (`gen_random_uuid()` via l’extension `pgcrypto`)

## Démarrage local

```bash
# 1. Variables d'environnement
cp .env.example .env
# remplir DATABASE_URL, JWT_*_SECRET, SENDGRID_API_KEY…

# 2. Dépendances
npm install

# 3. Migrations (création des tables)
npm run db:migrate

# 4. Lancer en dev
npm run dev
# → http://localhost:4000
```

Healthcheck : `GET /health`

## Endpoints — préfixe `/api/v1`

| Méthode | Route                       | Auth | Description                              |
| ------- | --------------------------- | :--: | ---------------------------------------- |
| POST    | `/auth/register`            |  —   | Inscription → tokens                     |
| POST    | `/auth/login`               |  —   | Connexion → tokens                       |
| POST    | `/auth/refresh`             |  —   | Renouvelle l’access token                |
| POST    | `/bookings/estimate`        |  —   | Estimation tarifaire                     |
| POST    | `/bookings`                 |  ✓   | Crée une réservation + email             |
| GET     | `/bookings`                 |  ✓   | Historique du client connecté            |
| PATCH   | `/bookings/:id/cancel`      |  ✓   | Annule une réservation                   |
| GET     | `/users/me`                 |  ✓   | Profil du client connecté                |
| PATCH   | `/users/me`                 |  ✓   | Modifie `firstName` / `phone`            |

## Sécurité

- Mots de passe : `bcryptjs` (10 rounds)
- JWT : access 15 min · refresh 7 jours (durées configurables)
- Headers HTTP durcis via `helmet`
- Schémas d’entrée validés par `zod` sur chaque route

## Déploiement

Compatible Railway.app / Render.com / Fly.io. Définir `DATABASE_URL` + secrets
JWT en variables d’environnement, lancer `npm run db:migrate` au release,
puis `npm start`.
