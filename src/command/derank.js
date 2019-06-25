const db  = require('../model');

module.exports = function(match, guild, channel, author, content, mentions) {
    let fields = [{
        name: 'Commande exécuté :',
        value: content
    }];
    return db.query('SELECT derank_user($1, $2, $3);', [match[1], match[2], guild.id]) // res[1] = user, res[2] role
    .then (res => {
        fields.push({
            name: 'Resultat',
            value: "<@"+match[1]+"> ne possède plus le role "+match[2]
        });
        return {field: fields};
    })
    .catch( err => {
        if (err.code == 'P0001') {
            fields.push({
                name: 'Error',
                value: err.detail
            });
            return {field: fields};
        } else {
            throw err;
        }
    });
}