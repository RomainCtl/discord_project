const db  = require('../model');

module.exports = function(match, guild, channel, author, content, mentions, bot) {
    return db.query('UPDATE serveur SET log_channel=$1 WHERE id=$2;', [Array.from( mentions.channels)[0][0] , guild.id])
    .then (res => {
        let fields = [
            {
                name: 'Commande exécuté :',
                value: content
            },
            {
                name: 'Message :',
                value: 'Changement du channel de log effectué avec succès'
            }
        ];
        return {field: fields};
    })
    .catch( err => {
        throw err;
    });
}