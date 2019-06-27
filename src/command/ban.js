const db  = require('../model');

const ban_embed = {
	color: 0xFF0B00,
	title: 'Alfred',
    url: 'http://localhost/bot_panel',
    author: {},
	fields: [],
	timestamp: new Date(),
	footer: {
		text: 'Merci de votre confiance',
		icon_url: '',
	}
};

// TODO manage custom command too !

module.exports = function(match, guild, channel, author, content, mentions, bot) {
    // match[2] => reason
    // match[4] => duration (number of days)
    // match[6] => channels restriction

    let duration = null;
    let channels_r = null;
    let options = {
        reason: match[2]
    };
    if (match[4] != undefined) {
        duration = match[4] * 86400; // convert to sec
        options['days'] = match[4];
    }
    if (match[6] != undefined)
        channels_r = match[6];

    let user_to_ban = guild.member(mentions.users.array()[0]);

    ban_embed.fields = [{
            name: "Attention !",
            value: "Vous venez d'être **banni** du serveur "+guild.name+" par un modérateur pour la raison suivante :\n \""+match[2]+'"'
    }];
    ban_embed.author = {name: author.name, icon_url: author.avatarURL}

    if (user_to_ban.bannable) {
        return user_to_ban.send({embed: ban_embed})
        .then( () => {
            return Promise.all([
                user_to_ban.ban(options),
                db.query(
                    'INSERT INTO sanction (reason, duration, channels, victim, author, serveur_id, s_type) VALUES ($1, $2, $3, $4, $5, $6, $7);',
                    [match[2], duration, channels_r, user_to_ban.id, author.id, guild.id, 'BAN']
                )
            ])
            .then( () => {
                return {field: [
                    {
                        name: 'Commande executé :',
                        value: content
                    }, {
                        name: 'Message',
                        value: "L'utilisateur <@"+user_to_ban.id+"> viens d'être ban !"
                    }, {
                        name: 'Raison',
                        value: match[2]
                    }
                ]};
            })
            .catch( err => {
                return {field: [
                    {
                        name: 'Commande exécuté :',
                        value: content
                    }, {
                        name: 'Message',
                        value: "L'utilisateur <@"+user_to_ban.id+"> viens d'être ban !"
                    }, {
                        name: "Mais aucun message n'a pu lui être envoyé !",
                        value: err.message
                    }
                ]};
            });
        })
        .catch(err => {
            throw err;
        });
    } else {
        return new Promise( (resvole, reject) => {
            reject({
                field: [
                    {
                        name: 'Commande executé :',
                        value: content
                    }, {
                        name: 'Message :',
                        value: "L'utilisateur <@"+user_to_ban.id+"> ne peut pas etre ban !"
                    }
                ]
            });
        });
    }
}