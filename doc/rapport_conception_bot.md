# Rapport de fin de projet Web et BDD
## Alfred - 'Bot de modération Discord'
___



Dans le cadre de notre projet web, nous cherchons à mettre en place un bot sur l'application de chat en ligne __discord__,
le but étant de mettre en place un bot pouvant réaliser les tâches suivantes :
> - Gérer la modération en permettant au bot de créer ou supprimer des modérateurs sur le serveur Discord
> - Gérer les sanctions en permettant au bot de punir des utilisateurs en recevant une commande d'un modérateur
> - Détecter les comportements illicites tels que le spamming et le punir en conséquence sans passer par le biais d'un modérateur.

En prime, nous mettrons en place une interface web permettant de gérer le bot sur un site à part,
ce site web disposera des fonctionnalités suivantes :
> - Permettre la diffusion publique du bot
> - Chaque utilisateur ayant le bot installé sur son serveur doit avoir accès à un panel
> d’administration. Ce panel d’administration doit permettre d’activer/désactiver ou/et de configurer
> certaines fonctionnalités du bot.

Notre mission doit donc nous amener à comprendre le fonctionnement d'un serveur node js, et établir un lien entre notre application et un élément extérieur.

Au travers de ce rapport nous verrons la manière dont nous avons réalisé ces tâches, en commencant par l'élaboration d'un serveur node js utilisant des websocket afin de communiquer avec l'API discord, puis la réalisation du bot avec Discord.js et enfin la réalisation de notre panel de gestion du bot.


Pour toutes questions en ce qui la base de données, vous pouvez vous référer à notre précédent rapport  __`rapport_conception_db.md`__ (Attention, la base de données a légèrement été modifié depuis).


## Création d'un bot Discord

La première partie de notre travail de création d'un bot Discord est évidemment de déclarer le bot. Pour ce faire nous nous renderons sur le portail Developers de discord à l'adresse : __'https://discordapp.com/developers/applications/'__
![Portail Developers de Discord](./rapport_bot_picture/developer_portal.png)

On crée une application qui deviendra notre futur bot. Discord nous fournit ce portail afin de simplifier la création d'application sur leur plateforme et afin de répertorier les bots créé par la communauté.

On se rend ensuite dans l'onglet **"Bot"** afin de confirmer que notre application est un utilisateur robot, une fois que l'on confirme la nature de notre application nous serons données par Discord un __`Token`__ qui sera utilisé par notre application node js afin de s'identifier sur discord.


## Mise en place du WebSocket

Afin de comprendre le principe derrière la discussion entre node js et Discord. Nous avons commencé par mettre en place un webSocket qui nous permet d'établir une connection persistante avec le l'api discord. Ensuite, il suffit de s'identifier avec le __token__ unique et d'envoyer un signal tous les X temps afin d'annoncer que le bot est toujours en fonctionnement. Par manque de temps, nous avons simplement créer un micro-bot qui répond "Pong" lorsqu'un message "ping" est envoyé depuis un serveur discord.

L'intérêt de cette partie est double, comprendre le fonctionnement des websockets car c'est quelque chose que nous n'avions jamais manipulé, et comprendre le fonctionnement de discord et de son API.

La solution développer pour ce ping-pong se trouve dans le dossier `./src/pingpong` et comprend deux fichiers, un pour la communication avec l'api (utilisations du module `axios`) et l'autre pour la gestion évenementielle.

> Pour tester cette réalisation, il suffit d'utiliser la commande : `npm run pingpong` depuis un terminal.


### Fonctionnement des WebSockets

Le but des WebSockets est de mettre en place une liaison entre l'api Discord et notre fichier serveur javascript (ici notre bot). Pour ce faire nous commençons par déclarer un objet webSocket `client`, ce qui nous permet d'initialiser la connection par le protocol `wss`. Puis il suffit de déclarer les fonctions à appelé lors de la réception d'un certain évennement.


### Discord.js

// TODO avantage/inconvéniants ..., évenements : de quoi avons besoin (ready, message, delete, update, ...)


### Commandes

// TODO gestion (rappel sur les commandes globals), la possibilité de créer des commandes, l'utilisation de regex, (et la création dynamic de regex), generiquen ...


#### Création dynamic de regex

// TODO (voir les fichiers dans le dossier ./src/util)


### Base de données

// TODO en parler un peut, (config dans le fichier src/model/index.js), comment on a mise en place (comment ca va etre utilise apres)


## Panel d'administration Web

Le panel est la troisième et dernière partie de notre projet. Nous devons mettre en place une interface afin de pouvoir administrer le bot depuis une page web.

Cette interface comporte une page d'accueil par lequel nous nous connectons à discord ainsi que d'un lien permettant d'appeler le bot sur votre serveur Discord.

> Page d'accueil de notre application web :

![home_page](./rapport_bot_picture/panel_home.png)

### Identification

// TODO utilisation de oauth2 avec l'api DISCORD (identifiants discords...) + whitelist en BDD
// peut accéder à plusieurs serveurs si on est dans la whiteliste de plusieurs serveurs par exemple...


### Panel

Le panel est retrouvable dans le dossier `./src/web` mais il utilise les fonctions déjà défini dans le dossier `./src/command` puisque tout ce qui est fait sur le panel peut etre fait en ligne de commande sur le serveur discord.

### Les données brut

Pour l'affichage de la page d'administration d'un serveur, les données sont envoyées dans un seul objet :

```JS
var guild = {
    id: 'snwoflake',
    name: 'string',
    icon: 'url',
    owner: {
        username: 'string',
        locale: 'string',
        mfa_enabled: false,
        flags: 0,
        avatar: 'url',
        discriminator: 'int',
        id: 'snowflake'
    },
    log_channel: '<snowflake:channel_id>',
    staff: {
        '<snowflake:user_id>': {
            id: '<snowflake:user_id>',
            username: 'string',
            avatar: 'url',
            roles: [Array<role:id>]
        }
    },
    roles: {
        '<int:id>':	{
            id: 1,
            name: 'ModerateurAlpha',
            priority: 2,
            commands: [Array<command:id>]
        }
    },
    commands: {
        '1': {
            id: 1,
            command: '<string:command_help>',
            regex: 'string'
        }
    },
    whitelist: [Array<user_id>],
    members: {
        '<snowflake:user_id>': {
            nick: 'string',
            user: [Object<Discord_api_user>],
            roles: [Array<Discord_guild_roles>],
            premium_since: null,
            deaf: false,
            mute: false,
            joined_at: 'timestamp'
        },
    },
    channels: {
        '<snowflake:channel_id>': {
            permission_overwrites: [Array],
            name: 'string',
            parent_id: null,
            nsfw: false,
            position: 0,
            guild_id: '<snowflake:guild_id>',
            type: 4,
            id: '<snowflake:channe_id>'
        },
    },
    owner_id: '<snowflake:user_id>'
}
```

// TODO 2-3 explications

### L'affichage

![panel_top](./rapport_bot_picture/panel_1.png)
![panel_bot](./rapport_bot_picture/panel_2.png)

### API

// TODO l'api créé pour l'édition des données, chaque 'partie' sur les interfaces sont indépendantes

### Front

// TODO vanilla pur (par manque de temps de prendre en mains une autre solution), module axios pour les requtes REST, affichage dynamique, ...




## Conclusion

// TOOD
















_________________________________________________________________

### RegExp


Au vu de son importance capital dans notre projet, regExp nécessite une explication.

RegExp est un constructeur JavaScript permettant de reconnaitre une chaine de caractère afin d'en extraire des informations nécessaires au bon déroulement de la commande :

> *Exemple :*
>
> message.match( new RegExp('^!ping[ ]*$', 'i') ) )
>
>
> `message.match()` : Check si le message est correcte par rapport à la fonction en paramètre
>
> `RegExp()` : Check si le message correspond au string en paramètre
>
> `'^!ping[ ]*$'` : si le message correspond à ce pattern alors le regExp retourne vrai
>
> `'i'` : on indique que le message doit être converti en minuscule, sans majuscule


Avec ce que nous avons pu tirer de notre travail sur le webSocket et les différents composants nécessaires, nous avons enfin pu nous lancer sur la réalisation de notre bot d'administration Discord.


## Conception du bot avec Discord.js


> Afin de faciliter la réalisation de notre bot, nous avons choisi d'utiliser la bibliothèque __discord.js__.

Grâce à l'outil discord.js, nous pouvons simplifier la mise en place du bot, à l'aide des différentes fonction déjà présentes dans l'extension. Cependant la simplification ouvre la porte à l'étendue du problème de la réalisation de l'application et afin de la simplifier, nous avons découpé l'application en plusieurs dossiers, chacun devant traités un aspect spécifique du bot :


### src/index.js


Le fichier en charge de traiter la connexion du bot au serveur, ainsi que la récupération des messages addressé au bot avant de les envoyer vers un index de traitement. Cela inclut notamment la détection de si le message est destiné au bot et vient d'un autre bot (dans ce cas il est ignoré) ou d'un utilisateur humain. Dans ce cas le message est envoyé dans la commande __`check_and_run()`__ de src/command.index.js afin de vérifier si le message vient d'un propriétaire légitime ou non.

Le fichier index.js est disponible dans /src/


### src/command/index.js


Le fichier index.js dans ./src/command/ à pour but de traiter les commandes envoyées par un utilisateur. Il commence d'abord par vérifier si l'utilisateur est légitime dans sa demande en vérifiant s'il dispose des droits nécessaires.

S'il dispose des droits nécessaires la commande est passée au travers d'un moulinage de **Regex** afin de comprendre de quelle commande il s'agit. Si la commande est trouvée, elle est immédiatement exécutée par l'appel d'une fonction **`callfunc()`** qui traitera la fonction reçue.

Si le match() ne retourne rien, alors il ne s'agit pas d'une fonction n'est pas traité.


### Les commandes globales


Nous nous sommes très vite rendu compte que pour effectuer les commandes de manière optimisée dans leurs traitements, il était nécessaire de créer des fichiers personalisés pour chaque commande globale. Les commandes globales traitent un problème de manière précise et unique en fonction de la commande global appelé par le **regex**.

> Voici la liste des commandes globales et leurs fichiers de traitement :

* Bannir un utilisateur :\
`ban.js`
* Exclure un utilisateur :\
`kick.js`
* Rendre sourd un utilisateur :\
`deaf.js`
* Rendre muet un utilisateur :\
`mute.js`
* Avertir un utilisateur :\
`warn.js`
* Déclarer un channel comme channel de logs pour le bot :\
`setlogchannel.js`
* Annuler une sanction par son id :\
`cancel.js`
* Ajouter un role de moderation à un utilisateur :\
`rankup.js`
* Retirer un role de moderation à un utilisateur :\
`delrank.js`
* Ajouter un rôle (le créer) :\
`addrole.js`
* Supprimer un rôle :\
`delrole.js`
* Ajouter une commande à un rôle :\
`role_add.js`
* Retirer une commande à un rôle :\
`role_del.js`
* Récupérer les sanctions appliquées à un utilisateur :\
`getto.js`
* Récupérer les sanctions appliquées par un modérateur :\
`getfrom.js`
* Verouiller un ou des channels :\
`lock.js`
* Déverouiller un ou des channels :\
`delock.js`
* Supprimer les messages d'un channels (message d'un joueur et/ou depuis x sec) :\
`delmsg.js`
* Obtenir la liste des commandes sur le serveur :\
`help.js`


>   *Description de `lock.js` :*
>
>   lock.js fût le premier nécessitant la création d'un rôle afin de le faire fonctionner.
>
>   En effet, afin de verrouiller les channels, il est nécessaire de bloquer les utilisateurs en leur retirant les droits de lecture, écriture sur le channel, cependant cela ne pouvait pas être fait sur le rôle @everyone car cela aurait posé beaucoup plus de travail sur lock.js pour le mettre en place.
>
>   Au lieu de cela, nous avons créé un rôle lock, de priorité très forte et on le donne à tout le monde. Ainsi, ceux ayant ce rôle se voient incapables d'écrire/lire sur le channel. Bien sûr, l'administrateur et les modérateurs autorisés peuvent continuer à écrire/lire dessus.
>


>   *Description de `cancel.js` :*
>
>   cancel.js est un fichier nous permettant d'annuler une sanction d'après son id dans la base de données. Après avoir exécuté une commande dans la bdd pour vérifier l'existence de la sanction, cette dernière est effacée de la base et en fonction de son type on applique différents traitements permettant d'annuler les punitions appliquées.
>
>   Noter que cancel.js efface aussi la commande des logs, elle n'est plus retrouvable après.
>


>   *Description de `setlogchannel.js` :*
>
>   Une commande particulière qui permet de transformer un channel en un channel de logs, cela signifie que le bot emploiera ce channel pour décrire toute les actions qu'il effectue.
>
>   Pour mettre en place ce channel, la commande accède à la base de données et à l'intérieur du serveur lui indique quel channel (donc l'id du channel) auquel il doit envoyer envoyer les logs du bot.
>
>   Si aucun channel de log n'est en place, alors le bot n'envoi aucun log.
>   ![Portail Developers de Discord](./rapport_bot_picture/channel_log.png)
>

>   *Description de `help.js` :*
>
>   Une commande permettant de récupérer de la base de données l'ensemble des commandes présente sur le serveur.
> ![Portail Developers de Discord](./rapport_bot_picture/help.png)
>


Chacune de ces commandes est retrouvable au sein du dossier ***/command/*** et dispose de sa propre manière de traiter l'information reçu en paramètre. Elle retourne toujours un message en cas d'erreur.
