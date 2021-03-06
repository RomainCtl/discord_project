const db  = require('../model');

const warn_embed = {
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
    let user_to_warn = mentions.users.array()[0];

    warn_embed.fields = [{
            name: "Attention !",
            value: "Vous venez de recevoir un **avertissement** de la part d'un modérateur :\n \""+match[2]+'"'
    }];
    warn_embed.author = {name: author.name, icon_url: author.avatarURL}
    return user_to_warn.send({embed: warn_embed})
    .then( msg => {
        return {field: [
            {
                name: 'Commande exécuté :',
                value: content
            },{
                name: 'Message :',
                value: "Avertissement donnée avec succès."
            }
        ]};
    })
    .catch( err => {
        return {field: [
            {
                name: 'Commande exécuté :',
                value: content
            },{
                name: 'Erreur :',
                value: err.message
            }
        ]};
    });
}