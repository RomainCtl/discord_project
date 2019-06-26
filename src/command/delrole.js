const db  = require('../model');

module.exports = function(match, guild, channel, author, content, mentions) {
    let fields = [{
        name: 'Commande exécuté :',
        value: content
    }];
    return db.query('DELETE FROM role WHERE id = $1 RETURNING name;', [match[1]]) // res[1] = id du role
    .then (res => {
        if (res.rowCount == 0) {
            fields.push({
                name: 'Role inexistant !',
                value: match[1]
            });
            return {field: fields};
        } else {
            fields.push({
                name: 'Nom du role supprimer :',
                value: res.rows[0].name,
                inline: true
            });
            return {field: fields};
        }
    })
    .catch( err => {
        throw err;
    });
}