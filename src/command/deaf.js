const db  = require('../model');
const deaf = require('../model/deaf')

const deaf_embed = {
	color: 0xFFD000,
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

module.exports = function(match, guild, channel, author, content, mentions, bot) {
    // match[2] => reason
    // match[4] => duration
    // match[6] => chan list
    let user_to_deaf = guild.member(mentions.users.array()[0]); // la regex valide la fait qu'il y ai forcement un user mentionne

    let chan_list = Array.from(guild.channels.values());
    let match_chan = null;
    let duration = null;

    if (match[4] != undefined) duration = match[4];

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

    deaf_embed.fields = [{
        name: "Attention !",
        value: "Vous venez d'être **aveuglé** sur les channels *"+chan_list.join(", ")+"* du serveur "+guild.name+" par un modérateur pour la raison suivante :\n \""+match[2]+'"'
    }];
    deaf_embed.author = {name: author.name, icon_url: author.avatarURL}

    return deaf.deaf_user(guild, user_to_deaf, chan_list)
    .then( () => {
        return Promise.all([
            db.query(
                'INSERT INTO sanction (reason, duration, channels, victim, author, serveur_id, s_type) VALUES ($1, $2, $3, $4, $5, $6, $7);',
                [match[2], duration, match_chan, user_to_deaf.id, author.id, guild.id, 'DEAF']
            ),
            user_to_deaf.send({embed: deaf_embed})
        ])
        .then( () => {
            return {field: [
                {
                    name: 'Commande executé :',
                    value: content
                }, {
                    name: 'Message',
                    value: "L'utilisateur <@"+user_to_deaf.id+"> est maintenant sourd !\n*channels concernée :* "+chan_list.join(", ")
                }, {
                    name: 'Raison',
                    value: match[2]
                }
            ]};
        })
        .catch( () => {
            return {field: [
                {
                    name: 'Commande exécuté :',
                    value: content
                }, {
                    name: 'Message',
                    value: "L'utilisateur <@"+user_to_deaf.id+"> est maintenant sourd !\n*channels concernée :* "+chan_list.join(", ")
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
}