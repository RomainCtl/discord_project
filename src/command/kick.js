const db  = require('../model');

const kick_embed = {
	color: 0xFFD000,
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
    let user_to_kick = guild.member(mentions.users.array()[0]);

    kick_embed.fields = [{
            name: "Attention !",
            value: "Vous venez d'être **explusé** du serveur "+guild.name+" par un modérateur pour la raison suivante :\n \""+match[2]+'"'
    }];
    kick_embed.author = {name: author.name, icon_url: author.avatarURL}

    if (user_to_kick.kickable) {
        return user_to_kick.send({embed: kick_embed})
        .then( () => {
            return Promise.all([
                user_to_kick.kick(match[2]),
                db.query(
                    'INSERT INTO sanction (reason, duration, channels, victim, author, serveur_id, s_type) VALUES ($1, $2, $3, $4, $5, $6, $7);',
                    [match[2], null, null, user_to_kick.id, author.id, guild.id, 'KICK']
                )
            ])
            .then( () => {
                return {field: [
                    {
                        name: 'Commande executé :',
                        value: content
                    }, {
                        name: 'Message',
                        value: "L'utilisateur <@"+user_to_kick.id+"> viens d'être kick !"
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
                        value: "L'utilisateur <@"+user_to_kick.id+"> viens d'être kick !"
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
                        value: "L'utilisateur <@"+user_to_kick.id+"> ne peut pas etre kick !"
                    }
                ]
            });
        });
    }
}