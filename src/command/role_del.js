const db  = require('../model');

module.exports = function(match, guild, channel, author, content, mentions, bot) {
    let fields = [{
        name: 'Commande exécuté :',
        value: content
    }];

    //On efface de la base de données la commande du rôle qui correspond à celui dont l'id est appelé par la commande en paramètre
    return db.query('DELETE FROM role_cmd WHERE role_id=$1 AND cmd_id=$2;', [match[1], match[2]]) // res[1] = role_id, res[2] cmd_id
    .then (res => {
        //Si la table renvoi quelque chose alors on à réussi à effacer la commande du rôle et l'utilisateur est prévenu :
        if (res.rowCount == 1) {
            fields.push({
                name: 'Message',
                value: "Commande "+match[2]+" supprimé du rôle "+match[1]+" avec succès !",
                inline: true
            });
        //Sinon, cela signifie que le rôle n'avait pas cette commande de base et on renvoi une erreur :
        } else {
            fields.push({
                name: 'Erreur',
                value: "Cette role n'a pas accès à cette commande, impossible de la supprimer !",
                inline: true
            });
        }
        return {field: fields};
    })
    .catch( err => {
        throw err;
    });
}