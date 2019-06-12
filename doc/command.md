## Sanctions (commandes parametrable selon le(s) rôle(s))

* Ban :             `!ban @<user> <reason:text> [-d <duration:time(sec)>, -c <channels:list>]`
* Kick :            `!kick @<user> <reason:text> [-c <channels:list>]`
* Deaf (sourdine) : `!deaf @<user> <reason:text> [-d <duration:time(sec)>, -c <channels:list>]`
* Mute :            `!mute @<user> <reason:text> [-d <duration:time(sec)>, -c <channels:list>]`
* Warn :            `!warn @<user> <reason:text>`

### Restrictions possibles (et syntax)

> Sur les paramètres optionnels (duration et channels)

```
duration (<|>) <time(sec)>
channels [NOT] IN <channels:list>
```

* Créer une sanctions custom : `!create (ban|kick|deaf|mute) -d <duration_restriction> -c <channels_restriction>` \
il doit y avoir au moins une restriction et pour la creation d'un *kick*, il ne peut pas y avoir de *duration_restriction*

#### Exemple
```S
!create ban -d <3600 -c IN (chan1,chan2,*general)

!create kick -c NOT IN (.text)

!create mute -d >60 -c NOT IN (.text)
```

### Syntax du paramètre `channels`

> Ce paramètre peut être un element (channel) ou une liste de channels séparé par une virgule \
> Il peut également être un type de channel (vocal: `.audio`, textuel : `.test`) \
> Et aussi une catégorie de channel (`*<name>`)

#### Exemples
```S
... chan1
... chan1,chan2
... chan1,.text
... .audio
... chan1,*staff
```


## Autres commandes

* Annuler une sanction :                                    `!cancel <id_sanction>`
* Ajouter un modo :                                         `!rankup @<user> <role_id>`
* Retirer un modo :                                         `!derank @<user> <role_id>`
* Ajouter un role :                                         `!addrole <name>`
* Retirer un role :                                         `!delrole <id>`
* Ajouter une permission à un role :                        `!role add <role_id> <permission>`
* Retirer une permission à un role :                        `!role del <role_id> <permission>`
* Récupérer toutes les sanctions d'un user :                `!getto @<user>`
* Récupérer toutes les sanctions donné par un modérateur :  `!getfrom @<modo>`
* Vérouiller un ou des channel(s) :                         `!lock <channels:list>`  // meme parametre que pour les commandes de sanctions
* Déverrouiller un ou des channel(s) :                      `!delock <channels:list>`
* Supprimer les messages d'un channel                       `!delmsg <channel> [-d <duration>, -u @<user>]`