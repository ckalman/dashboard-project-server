# Installation du projet : 

Après avoir cloné le projet depuis github, executer les commandes suivantes : 

```bash
npm install
```

Quand l'install est terminé faire :

```bash
npm start
```

Avant d'appeler le serveur pour la première fois, lancer les seeds pour remplir la base de données : 

```
localhost:23000/seed
```


# Routes sécurisées

Le back-end propose des routes sécurisées à l'aide d'un JWT token. Pour cela, il faut récupérer le token lors de l'authentification, dans le json puis le mettre dans le header des requêtes sécurisées :

request.setHeader("x-access-token", TOKEN);