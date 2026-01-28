# 🍽️ DishDay - Application de Gestion de Repas

Application web complète de gestion de repas, recettes et courses. Mobile-first, dark mode, mono-utilisateur.

## 📋 Fonctionnalités

### 🍽️ Onglet Repas (Principal)
- Suggestion automatique de recette selon l'heure (matin/midi/soir)
- Historique des propositions pour éviter les répétitions
- Recherche instantanée de produits
- Gestion de liste de courses
- Produits récents pour ajout rapide
- Gestion des magasins

### 🛒 Onglet Courses
- CRUD complet des produits/ingrédients
- Photos, quantités, unités
- Association aux magasins
- Statut : en stock / à acheter
- Recherche et filtres (magasin, statut)

### 📖 Onglet Recettes
- CRUD complet des recettes
- Photos, temps de préparation/cuisson
- Type de repas (petit-déjeuner, déjeuner, dîner)
- Liste d'ingrédients avec quantités
- Statut des ingrédients (en stock/manquant)

## 🏗️ Architecture

### Stack Technique
- **Frontend**: React 18 (hooks, functional components)
- **Backend**: Node.js + Express
- **Base de données**: SQLite avec Prisma ORM
- **API**: REST JSON
- **UI**: CSS moderne, dark mode
- **Navigation**: Swipe gauche/droite (react-swipeable)

### Structure du Projet
```
dishday/
├── client/                 # Frontend React
│   ├── public/
│   └── src/
│       ├── components/     # Composants React
│       ├── App.js
│       ├── App.css
│       └── index.js
├── server/                 # Backend Node.js
│   ├── index.js           # Serveur Express + API REST
│   └── seed.js            # Données initiales
├── prisma/
│   ├── schema.prisma      # Schéma de base de données
│   └── dishday.db         # Base SQLite (générée)
├── package.json
└── README.md
```

## 🚀 Installation et Lancement

### Option 1 : Docker (Recommandé) 🐳

**Prérequis** : Docker et Docker Compose installés

```bash
# Lancer l'application complète avec Docker
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter l'application
docker-compose down
```

L'application sera accessible à : **http://localhost:5555**

**Toutes les données** (base de données, photos, etc.) sont stockées dans `./server/data/`

### Option 2 : Installation Locale

**Prérequis** : Node.js 16+ et npm

```bash
# 1. Installer les dépendances backend
npm install

# 2. Installer les dépendances frontend
cd client
npm install
cd ..

# 3. Créer le fichier .env
echo "DATABASE_URL=file:./server/data/dishday.db" > .env

# 4. Créer le dossier de données
mkdir -p server/data

# 5. Générer le client Prisma
npx prisma generate

# 6. Créer la base de données et appliquer les migrations
npx prisma migrate dev --name init

# 7. Peupler la base avec des données d'exemple
npm run seed

# 8. Démarrer backend + frontend simultanément
npm start
```

L'application sera accessible à :
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Commandes Alternatives (Local)

```bash
# Démarrer uniquement le backend
npm run server

# Démarrer uniquement le frontend
npm run client

# Installation complète en une commande
npm run install-all
```

### Commandes Docker Utiles

```bash
# Reconstruire l'image après modifications
docker-compose up -d --build

# Voir les logs en temps réel
docker-compose logs -f dishday

# Redémarrer le conteneur
docker-compose restart

# Supprimer le conteneur et les volumes
docker-compose down -v

# Accéder au shell du conteneur
docker-compose exec dishday sh
```

## 📱 Utilisation

### Navigation
- **Swipe gauche/droite** pour changer d'onglet
- **Boutons de navigation** en haut de l'écran
- **Clic sur un élément** pour ouvrir le détail en modal

### Modales
- Modification en **temps réel** (auto-save)
- Pas de bouton "Valider"
- Clic en dehors pour fermer

### Onglet Repas
1. Consultez la suggestion du moment
2. Cliquez sur "🔄 Nouvelle proposition" pour changer
3. Recherchez des produits dans la barre de recherche
4. Cliquez sur un résultat pour l'ajouter à la liste de courses
5. Gérez vos magasins via le bouton "⚙️ Gérer les magasins"

### Onglet Courses
1. Utilisez les filtres (magasin, statut)
2. Cliquez sur "+ Ajouter un produit"
3. Cliquez sur une carte pour modifier
4. Les modifications sont sauvegardées automatiquement

### Onglet Recettes
1. Filtrez par type de repas
2. Cliquez sur "+ Ajouter une recette"
3. Ajoutez des ingrédients depuis la liste de produits
4. Les modifications sont sauvegardées automatiquement

## 🗄️ Base de Données

### Tables
- **stores**: Magasins (nom, photo, lien Google Maps)
- **products**: Produits/ingrédients (nom, photo, quantité, unité, magasin, statut)
- **recipes**: Recettes (nom, photo, temps, type de repas)
- **recipe_ingredients**: Association recettes-produits
- **shopping_list**: Liste de courses active
- **recent_items**: Produits récemment utilisés
- **meal_history**: Historique des suggestions de repas

### Emplacement des Données

**Avec Docker** : Toutes les données sont dans `./server/data/`
- Base de données : `./server/data/dishday.db`
- Photos : `./server/data/photos/`

**En local** : 
- Base de données : `./server/data/dishday.db`
- Photos : `./server/data/photos/`

### Réinitialiser la Base

**Avec Docker** :
```bash
# Arrêter et supprimer le conteneur avec les données
docker-compose down -v
rm -rf server/data/*
docker-compose up -d
```

**En local** :
```bash
# Supprimer et recréer la base
rm server/data/dishday.db
npx prisma migrate dev --name init
npm run seed
```

## 🎨 Design

- **Dark mode uniquement**
- **Mobile-first** et responsive
- **Animations fluides**
- **Interface intuitive**
- **Couleurs**: Fond #1a1a1a, Accent #4a9eff

## 📡 API REST

### Stores
- `GET /api/stores` - Liste des magasins
- `GET /api/stores/:id` - Détail d'un magasin
- `POST /api/stores` - Créer un magasin
- `PUT /api/stores/:id` - Modifier un magasin
- `DELETE /api/stores/:id` - Supprimer un magasin

### Products
- `GET /api/products?search=&storeId=&inStock=` - Liste des produits
- `GET /api/products/:id` - Détail d'un produit
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Recipes
- `GET /api/recipes?search=&mealType=` - Liste des recettes
- `GET /api/recipes/:id` - Détail d'une recette
- `POST /api/recipes` - Créer une recette
- `PUT /api/recipes/:id` - Modifier une recette
- `DELETE /api/recipes/:id` - Supprimer une recette

### Meal Suggestion
- `GET /api/meal-suggestion` - Suggestion de recette selon l'heure

### Shopping List
- `GET /api/shopping-list` - Liste de courses
- `POST /api/shopping-list` - Ajouter un produit
- `DELETE /api/shopping-list/:productId` - Retirer un produit

### Recent Items
- `GET /api/recent-items` - Produits récents

## 🔧 Développement

### Structure des Composants React
- `App.js` - Composant principal avec navigation par onglets
- `MealsTab.js` - Onglet repas et suggestions
- `ShoppingTab.js` - Onglet gestion des courses
- `RecipesTab.js` - Onglet gestion des recettes
- `ProductModal.js` - Modal CRUD produit
- `RecipeModal.js` - Modal CRUD recette
- `StoresModal.js` - Modal CRUD magasin

### Gestion d'État
- React hooks (useState, useEffect)
- Pas de Redux (application simple)
- Fetch API pour les requêtes HTTP

## 📝 Notes Techniques

- **Auto-save**: Les modales sauvegardent automatiquement les modifications
- **Recherche temps réel**: Debouncing via useEffect
- **Swipe navigation**: Bibliothèque react-swipeable
- **Images**: URLs externes (Unsplash dans les exemples)
- **Responsive**: Media queries pour mobile/desktop
- **Accessibilité**: Labels, focus, navigation clavier

## 🐛 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier que le port 5000 est libre
lsof -ti:5000 | xargs kill -9

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Le client ne démarre pas
```bash
cd client
rm -rf node_modules package-lock.json
npm install
cd ..
```

### Erreur Prisma
```bash
npx prisma generate
npx prisma migrate reset
npm run seed
```

## 📄 Licence

MIT

## 👨‍💻 Auteur

Application développée pour la gestion personnelle de repas et courses.
