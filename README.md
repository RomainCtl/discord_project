# discord_project

Bot de modération en NodeJS + site web/panel d’administration pour Discord

```
.
├── auth.json
├── doc
│   ├── ChantrelR-LE_GALA-Rapport_conception.tar.gz
│   ├── command.md
│   ├── data_example.sql
│   ├── dictionnaire_data.csv
│   ├── Énoncé-Projet-Web-et-Base-de-Donnée.pdf
│   ├── init.sql
│   ├── legend.png
│   ├── rapport_bot_picture
│   │   ├── channel_log.png
│   │   ├── developer_portal.png
│   │   └── help.png
│   ├── rapport_conception_bot.md
│   ├── rapport_conception_bot.pdf
│   ├── rapport_conception_db.md
│   ├── rapport_conception_db.pdf
│   ├── schema_associatif.drawio
│   ├── schema_associatif.png
│   ├── schema_logique.drawio
│   ├── schema_logique.png
│   └── sql_request.sql
├── package.json
├── package-lock.json
├── README.md
└── src
    ├── anti_spam.js
    ├── command
    │   ├── addrole.js
    │   ├── ban.js
    │   ├── cancel.js
    │   ├── create.js
    │   ├── deaf.js
    │   ├── delmsg.js
    │   ├── delock.js
    │   ├── delrole.js
    │   ├── derank.js
    │   ├── getfrom.js
    │   ├── getto.js
    │   ├── help.js
    │   ├── index.js
    │   ├── kick.js
    │   ├── lock.js
    │   ├── mute.js
    │   ├── rankup.js
    │   ├── role_add.js
    │   ├── role_del.js
    │   ├── setlogchannel.js
    │   └── warn.js
    ├── index.js
    ├── logger.js
    ├── model
    │   ├── ban.js
    │   ├── deaf.js
    │   ├── index.js
    │   ├── lock.js
    │   └── mute.js
    ├── pingpong
    │   ├── api.js
    │   └── index.js
    ├── util
    │   ├── chan_list_regex_creation.js
    │   └── number_regex_creation.js
    ├── web
    │   ├── config.js
    │   ├── public
    │   │   ├── css
    │   │   │   ├── bootstrap.css
    │   │   │   ├── bootstrap.min.css
    │   │   │   └── custom.css
    │   │   ├── fonts
    │   │   │   ├── glyphicons-halflings-regular.eot
    │   │   │   ├── glyphicons-halflings-regular.svg
    │   │   │   ├── glyphicons-halflings-regular.ttf
    │   │   │   ├── glyphicons-halflings-regular.woff
    │   │   │   └── glyphicons-halflings-regular.woff2
    │   │   ├── images
    │   │   │   ├── concert.jpg
    │   │   │   ├── discord_logo_black.png
    │   │   │   ├── discord_logo_white.png
    │   │   │   ├── header.jpg
    │   │   │   ├── iphone.jpg
    │   │   │   ├── microphone.jpg
    │   │   │   ├── pencil_sharpener.jpg
    │   │   │   └── writing.jpg
    │   │   └── js
    │   │       ├── bootstrap.js
    │   │       ├── bootstrap.min.js
    │   │       ├── custom.js
    │   │       ├── ie10-viewport-bug-workaround.js
    │   │       ├── jquery-1.11.3.min.js
    │   │       └── jquery.easing.min.js
    │   ├── resources
    │   │   ├── api
    │   │   │   ├── guild.js
    │   │   │   ├── roles.js
    │   │   │   ├── staff.js
    │   │   │   └── whitelist.js
    │   │   ├── discord_callback.js
    │   │   ├── home.js
    │   │   ├── login.js
    │   │   └── manage.js
    │   ├── router.js
    │   └── views
    │       ├── components
    │       │   ├── guild_choose.ejs
    │       │   ├── home.ejs
    │       │   └── manage.ejs
    │       ├── includes
    │       │   ├── footer.ejs
    │       │   ├── header.ejs
    │       │   └── header_home.ejs
    │       └── index.ejs
    └── webapp.js

18 directories, 96 files
```

> To run bot : `npm run start`

> To run bot in dev mod (restart on each edit) : `npm run debug`

> To run 'Ping Pong' test with websocket and without Discord.js : `npm run pingpong`