# Moveo — App mobile

App React Native (Expo SDK 51) en TypeScript strict — front du MVP Moveo Group.

## Démarrage

```bash
cp .env.example .env       # EXPO_PUBLIC_API_URL=http://<ton-ip-locale>:4000/api/v1
npm install
npm run start
```

Puis `i` pour iOS Simulator, `a` pour Android Emulator, ou scanner le QR avec
Expo Go sur un appareil physique.

> Sur appareil physique, remplace `localhost` par l’IP de la machine qui fait
> tourner le backend (ex. `192.168.1.42`) dans `.env` ET dans `app.json`
> (`extra.apiUrl`).

## Arborescence

```
src/
├── api/            Couche HTTP (Axios) — auth, bookings, users
├── components/     Composants UI réutilisables (boutons, inputs, états…)
├── constants/      theme.ts (palette), vehicles.ts, contact.ts
├── navigation/     Stacks + Bottom Tabs (auth · main · booking)
├── screens/        Écrans (auth · home · booking · history · support · profile)
├── storage/        Wrapper MMKV (tokens JWT)
└── store/          Zustand store auth
```

## Règles

- **TypeScript strict** — pas de `any` introduit volontairement
- **Palette** — uniquement via `src/constants/theme.ts` (jamais de hex en dur)
- **JWT** — stockés dans `react-native-mmkv` (jamais `AsyncStorage`)
- **Prix** — toujours calculés côté serveur (`POST /bookings/estimate`)
- **Chaque appel API** — loading state + error state avec bouton « Réessayer »
