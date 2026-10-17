# Prompt : application de chat avec une IA

Application web où l'utilisateur crée un compte, se connecte, puis pose des questions à une intelligence artificielle depuis une interface inspirée de Claude. Chaque utilisateur et chacune de ses questions sont enregistrés dans MongoDB. Les réponses de l'IA sont affichées à l'écran mais ne sont pas stockées.

## Technologies

| Partie | Technologie |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router |
| Backend | NestJS (Node.js), Mongoose |
| Base de données | MongoDB (Atlas) |
| Authentification | JWT, mots de passe hachés avec bcryptjs |
| Intelligence artificielle | API Google Gemini (offre gratuite) |

## Fonctionnalités

- Inscription (nom, prénom, email, mot de passe)
- Connexion avec jeton JWT valable 7 jours
- Page d'accueil qui salue l'utilisateur et propose une barre de prompt
- Envoi des questions à l'IA et affichage des réponses
- Enregistrement de l'utilisateur et de ses questions dans MongoDB
- Routes protégées : sans connexion, impossible d'interroger l'IA

## Architecture

```
Navigateur (React)  ->  Backend (NestJS)  ->  MongoDB Atlas
                              |
                              v
                          API Gemini
```

Le frontend ne parle jamais directement à la base ni à l'IA : les secrets (mot de passe de la base, clé API) restent côté serveur.

## Structure du projet

```
prompt-app/
├── backend/
│   └── src/
│       ├── auth/        inscription, connexion, JWT, guard
│       ├── users/       schéma et module utilisateur
│       ├── prompts/     questions, appel à l'IA
│       ├── app.module.ts
│       └── main.ts
└── frontend/
    └── src/
        ├── pages/       Home, Login, Register
        ├── api.js       communication avec le backend
        └── App.jsx      routes
```

## Prérequis

- Node.js (version récente) et npm
- Un cluster MongoDB Atlas (offre gratuite M0) avec un utilisateur de base de données et un accès réseau autorisé
- Une clé API Gemini, créée gratuitement sur https://aistudio.google.com

## Installation en local

### 1. Récupérer le code

```bash
git clone https://github.com/fotsingstephane45-code/prompt-app.git
cd prompt-app
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Ouvre le fichier `.env` et remplis les valeurs :

```
MONGODB_URI=mongodb+srv://UTILISATEUR:MOTDEPASSE@cluster0.xxxxx.mongodb.net/promptapp?appName=Cluster0
JWT_SECRET=une-longue-phrase-secrete
GEMINI_API_KEY=ta-cle-gemini
GEMINI_MODEL=gemini-3.8-flash
FRONTEND_URL=http://localhost:5173
```

Remplace `cluster0.xxxxx.mongodb.net` par l'adresse réelle de ton cluster (Atlas > Connect > Drivers). Le nom du modèle Gemini peut évoluer : utilise celui affiché dans Google AI Studio.

Lance le serveur :

```bash
npm run start:dev
```

Le backend écoute sur http://localhost:3000.

### 3. Frontend

Dans un second terminal :

```bash
cd frontend
npm install
npm run dev
```

Ouvre http://localhost:5173.

## Routes de l'API

| Méthode | Route | Description | Protégée |
|---|---|---|---|
| POST | `/auth/register` | Créer un compte | Non |
| POST | `/auth/login` | Se connecter, renvoie un jeton | Non |
| POST | `/prompts` | Enregistrer une question et obtenir la réponse de l'IA | Oui (jeton JWT) |

Les routes protégées demandent l'en-tête `Authorization: Bearer <jeton>`.

## Déploiement

Une combinaison possible (vérifie les conditions actuelles de chaque offre gratuite) :

1. **Base de données** : MongoDB Atlas, déjà en ligne.
2. **Backend** (Render, Railway ou autre) :
   - Dossier racine : `backend`
   - Build : `npm install && npm run build`
   - Démarrage : `npm run start:prod`
   - Variables : `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `FRONTEND_URL`
3. **Frontend** (Vercel, Netlify ou autre) :
   - Dossier racine : `frontend`
   - Build : `npm run build`, dossier publié : `dist`
   - Variable : `VITE_API_URL` = adresse du backend, sans `/` final
4. Retourner sur le backend et renseigner `FRONTEND_URL` avec l'adresse du frontend, puis redéployer (sinon le navigateur bloque les requêtes à cause du CORS).

Le frontend est une application monopage : l'hébergeur doit renvoyer `index.html` pour toutes les adresses. Le fichier `frontend/vercel.json` couvre Vercel, et `frontend/public/_redirects` couvre Netlify et Cloudflare Pages.

## Sécurité

- Le fichier `.env` n'est jamais versionné (voir `.gitignore`). Seul `.env.example`, sans valeurs, est publié.
- Les mots de passe sont hachés avec bcrypt avant d'être stockés.
- Les messages d'erreur de connexion sont identiques pour un email inconnu et un mauvais mot de passe.
- Les données reçues sont validées côté serveur (class-validator).
- Le CORS n'autorise que l'adresse du frontend.

## Auteur

Projet réalisé par Stéphane Fotsing.
