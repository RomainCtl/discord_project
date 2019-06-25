const db  = require('../model');

module.exports = function(match, guild, channel, author, content, mentions) {
    let fields = [{
        name: 'Command exécuté :',
        value: content
    }];
    return db.query('DELETE FROM role_cmd WHERE role_id=$1 AND cmd_id=$2;', [match[1], match[2]]) // res[1] = role_id, res[2] cmd_id
    .then (res => {
        if (res.rowCount == 1) {
            fields.push({
                name: 'Message',
                value: "Commande "+match[2]+" supprimé du rôle "+match[1]+" avec succès !",
                inline: true
            });
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