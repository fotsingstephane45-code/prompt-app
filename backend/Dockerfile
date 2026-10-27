# Etape 1: compiler le TypeScript
#choix de l'image de base(Node sur Alpine,une version minuscule de linux)
FROM node:24-alpine AS build
#fixe le dossier de travail dans le conteneur
WORKDIR /app
#On copie d’abord package*.json et on installe, puis on copie le code : Docker réutilise ainsi les dépendances en cache tant que package.json ne change pas, ce qui accélère les builds.
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etape 2: créer l'image finale
FROM node:24-alpine AS final
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
#npm ci installe exactement les versions du package-lock.json.
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000
#CMD lance le serveur.
CMD ["node", "dist/main"]