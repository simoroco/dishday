# 🐳 Guide Docker - DishDay

## Démarrage Rapide

```bash
# Lancer l'application
docker-compose up -d

# Accéder à l'application
open http://localhost:5555
```

## Architecture Docker

### Image
- **Base** : `node:18-alpine` (légère, ~180MB)
- **Build multi-stage** : Frontend React compilé + Backend Node.js
- **Port exposé** : 5000 (mappé sur 5555 sur l'hôte)

### Volumes
- `./server/data` → `/app/server/data` : Toutes les données persistantes
  - Base de données SQLite
  - Photos
  - Fichiers générés

### Variables d'Environnement
- `NODE_ENV=production`
- `PORT=5000`
- `DATABASE_URL=file:/app/server/data/dishday.db`
- `TZ=Europe/Paris`

## Commandes Essentielles

### Gestion du Conteneur

```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Redémarrer
docker-compose restart

# Voir les logs
docker-compose logs -f

# Voir le statut
docker-compose ps
```

### Build et Mise à Jour

```bash
# Reconstruire après modifications du code
docker-compose up -d --build

# Forcer la reconstruction complète
docker-compose build --no-cache
docker-compose up -d
```

### Gestion des Données

```bash
# Sauvegarder les données
tar -czf backup-dishday-$(date +%Y%m%d).tar.gz server/data/

# Restaurer les données
tar -xzf backup-dishday-YYYYMMDD.tar.gz

# Réinitialiser complètement
docker-compose down -v
rm -rf server/data/*
docker-compose up -d
```

### Débogage

```bash
# Accéder au shell du conteneur
docker-compose exec dishday sh

# Voir les logs en temps réel
docker-compose logs -f dishday

# Inspecter le conteneur
docker inspect dishday

# Voir l'utilisation des ressources
docker stats dishday
```

## Personnalisation

### Changer le Port

Modifier dans `docker-compose.yml` :
```yaml
ports:
  - "8080:5000"  # Accès via http://localhost:8080
```

### Changer le Fuseau Horaire

Modifier dans `docker-compose.yml` :
```yaml
environment:
  - TZ=America/New_York
```

### Limiter les Ressources

Ajouter dans `docker-compose.yml` :
```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 1G
    reservations:
      cpus: '0.5'
      memory: 256M
```

## Healthcheck

Le conteneur inclut un healthcheck automatique :
- **Endpoint** : `http://localhost:5000/api/health`
- **Intervalle** : 30 secondes
- **Timeout** : 10 secondes
- **Retries** : 3
- **Start period** : 40 secondes

Vérifier le statut :
```bash
docker-compose ps
# Devrait afficher "healthy" dans la colonne Status
```

## Production

### Recommandations

1. **Reverse Proxy** : Utiliser Nginx ou Traefik devant le conteneur
2. **HTTPS** : Configurer SSL/TLS avec Let's Encrypt
3. **Sauvegardes** : Automatiser les backups de `server/data/`
4. **Monitoring** : Ajouter Prometheus/Grafana pour le monitoring
5. **Logs** : Configurer un driver de logs (syslog, json-file avec rotation)

### Exemple avec Nginx

```nginx
server {
    listen 80;
    server_name dishday.example.com;

    location / {
        proxy_pass http://localhost:5555;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Dépannage

### Le conteneur ne démarre pas

```bash
# Voir les logs d'erreur
docker-compose logs dishday

# Vérifier les permissions du dossier data
ls -la server/data/

# Reconstruire complètement
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### La base de données est corrompue

```bash
# Sauvegarder l'ancienne base
mv server/data/dishday.db server/data/dishday.db.backup

# Redémarrer le conteneur (créera une nouvelle base)
docker-compose restart
```

### Problème de permissions

```bash
# Donner les bonnes permissions au dossier data
chmod -R 755 server/data/
```

## Performance

### Optimisations

1. **Build cache** : Docker utilise le cache des layers
2. **Multi-stage build** : Réduit la taille de l'image finale
3. **Alpine Linux** : Image de base légère
4. **Production dependencies** : Seules les dépendances nécessaires sont installées

### Taille de l'Image

```bash
# Voir la taille de l'image
docker images dishday

# Nettoyer les images inutilisées
docker image prune -a
```

## Sécurité

### Bonnes Pratiques Implémentées

- ✅ Utilisateur non-root dans le conteneur
- ✅ `no-new-privileges` security option
- ✅ Healthcheck pour la disponibilité
- ✅ Restart policy `unless-stopped`
- ✅ Variables d'environnement pour la configuration
- ✅ Volumes pour la persistance des données

### Recommandations Supplémentaires

1. Scanner l'image pour les vulnérabilités : `docker scan dishday`
2. Utiliser des secrets Docker pour les données sensibles
3. Limiter les capacités du conteneur
4. Mettre à jour régulièrement l'image de base

## Support

Pour plus d'informations, consulter :
- [Documentation Docker](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- README.md principal du projet
