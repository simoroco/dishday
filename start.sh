#!/bin/bash

echo "🍽️  DishDay - Démarrage de l'application"
echo "========================================"
echo ""

if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose détecté"
    echo ""
    echo "Lancement avec Docker sur le port 5555..."
    echo ""
    
    mkdir -p server/data
    
    docker-compose up -d
    
    echo ""
    echo "✅ Application démarrée !"
    echo ""
    echo "🌐 Accès : http://localhost:5555"
    echo ""
    echo "📋 Commandes utiles :"
    echo "  - Voir les logs : docker-compose logs -f"
    echo "  - Arrêter : docker-compose down"
    echo "  - Redémarrer : docker-compose restart"
    echo ""
else
    echo "⚠️  Docker Compose non détecté"
    echo ""
    echo "Installation locale en cours..."
    echo ""
    
    if [ ! -d "node_modules" ]; then
        echo "📦 Installation des dépendances backend..."
        npm install
    fi
    
    if [ ! -d "client/node_modules" ]; then
        echo "📦 Installation des dépendances frontend..."
        cd client && npm install && cd ..
    fi
    
    mkdir -p server/data
    
    if [ ! -f ".env" ]; then
        echo "📝 Création du fichier .env..."
        echo "DATABASE_URL=file:./server/data/dishday.db" > .env
    fi
    
    if [ ! -f "server/data/dishday.db" ]; then
        echo "🗄️  Initialisation de la base de données..."
        npx prisma generate
        npx prisma migrate dev --name init
        npm run seed
    fi
    
    echo ""
    echo "✅ Démarrage de l'application..."
    echo ""
    echo "🌐 Frontend : http://localhost:3000"
    echo "🌐 Backend API : http://localhost:5000"
    echo ""
    
    npm start
fi
