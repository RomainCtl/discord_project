const db  = require('../model');

module.exports = function(match, guild, channel, author, content, mentions, bot) {
    let fields = [{
        name: 'Commande exécuté :',
        value: content
    }];
    //Le but de la commande role_add est d'ajouter à une commande un rôle auxquel elle est affilié :

    //On insère dans la table role_cmd de la base de données que le rôle et la commande ont une liaison :
    return db.query('INSERT INTO role_cmd (role_id, cmd_id) VALUES ($1, $2);', [match[1], match[2]]) // res[1] = role_id, res[2] cmd_id
    .then (res => {
        //On envoi ensuite un message pour indiquer que la commande à réussi l'insertion
        fields.push({
            name: 'Message',
            value: "Commande ajouté avec succès au rôle "+match[1]+" !",
            inline: true
        });
        //On retourne le résultat
        return {field: fields};
    })
    .catch( err => {
        if (err.code == '23503' || err.code == 'P0001') {
            fields.push({
                name: 'Erreur :',
                value: err.detail
            });
            return {field: fields};
        } else {
            throw err;
        }
    });
}