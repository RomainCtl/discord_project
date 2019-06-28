const db  = require('../model');
const ban = require('../model/ban')

const ban_embed = {
	color: 0xFF0B00,
	title: 'Alfred',
    url: 'http://localhost:4000/',
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

    let chan_list = Array.from(guild.channels.values());
    let duration = null;
    let match_chan = null;
    let options = {
        reason: match[2]
    };

    if (match[4] != undefined) {
        duration = match[4];
        options['days'] = match[4]/86400; // sec to day
    }

    let user_to_ban = guild.member(mentions.users.array()[0]);

    // ne prendre que les channels concernés
    if (match[6] != undefined) {
        match_chan = match[6].split(new RegExp('[ ]+', 'i'));
        chan_list = chan_list.filter( chan => {
            for (let i=0 ; i<match_chan.length ; i++)
                if ((match_chan[i] == ".audio" && chan.type == "voice") || match_chan[i] == '<#'+chan.id+'>' || (match_chan[i] == ".text" && chan.type == "text") )
                    return true;
            return false;
        });
        match_chan = match_chan.join(" ");
    }

    if (match_chan == null)
        chan_list = []; // if no channel specified, ban discord

    ban_embed.fields = [{
            name: "Attention !",
            value: "Vous venez d'être **banni** du serveur "+guild.name+" par un modérateur pour la raison suivante :\n \""+match[2]+'"'
    }];
    ban_embed.author = {name: author.name, icon_url: author.avatarURL}

    if (user_to_ban.bannable) {
        return user_to_ban.send({embed: ban_embed})
        .then( () => {
            return Promise.all([
                ban.ban_user(guild, user_to_ban, chan_list, options),
                db.query(
                    'INSERT INTO sanction (reason, duration, channels, victim, author, serveur_id, s_type) VALUES ($1, $2, $3, $4, $5, $6, $7);',
                    [match[2], duration, match_chan, user_to_ban.id, author.id, guild.id, 'BAN']
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