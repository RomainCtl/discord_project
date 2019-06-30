# discord_project

Bot de modération en NodeJS + site web/panel d’administration pour Discord


## Structure du projet
```
./discord_project
├── doc/
│── src/
│   ├── command/
│   ├── model/
│   ├── pingpong/
│   │   ├── api.js
│   │   └── index.js
│   ├── util/
│   ├── web/
│   │   ├── public/
│   │   │   ├── css/
│   │   │   ├── fonts/
│   │   │   ├── images/ener.jpg
│   │   │   │   └── writing.jpg
│   │   │   └── js/
│   │   ├── resources/
│   │   ├── views/
│   │   │   ├── components/
│   │   │   ├── includes/
│   │   │   └── index.ejs
│   │   ├── config.js
│   │   └── router.js
│   ├── anti_spam.js
│   ├── index.js
│   ├── logger.js
│   └── webapp.js
├── auth.json
├── package-lock.json
├── package.json
└── README.md

18 directories, 96 files
```

On peut diviser la structure du projet en trois parties :
* __Ping-pong__ :\
micro-bot utilisant les websockets et n'utilisant que l'api discord. \
*dossier `./src/pingpong`*

* __Bot__ :\
Version final de notre bot, développé à l'aide `discord.js`. \
*dossier ./src (sauf `./src/pingpong` et `./src/web`)*

* __Panel Web__ :\
Panel d'administration afin de compléter notre bot, développé avec `express`. \
*dossier ./src/web mais il utilise aussi ce qui a ete développé pour le bot (`./src/command`, `./src/model`)*


## Base de données

> Nous utilisons PostgreSQL v10 (liens : [page de téléchargement](https://www.enterprisedb.com/fr/downloads/postgres-postgresql-downloads))

> Et vous trouverez un fichier `./doc/init.sql` qui permet d'initialiser le projet.

> Les identifiants à configurer sont dans le fichier `./src/model/index.js` \
*(host, port, username, password, database)*


## Commandes utiles au projet

```JSON
"scripts": {
    "pingpong": "node ./src/pingpong/index.js",
    "dev": "nodemon ./src/index.js",
    "start": "node ./src/index.js",
    "webdev": "nodemon ./src/webapp.js",
    "web": "node ./src/webapp.js"
},
```

> Avant toutes chose, intaller les dépendances : `npm install`

> Lancer le bot : `npm run start`

> Lancer le serveur web : `npm run web`