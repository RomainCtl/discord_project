const db  = require('../model');

module.exports = function(match, guild, channel, author, content, mentions) {
    let fields = [{
        name: 'Commande exécuté :',
        value: content
    }];
    return db.query('INSERT INTO role (name, priority, serveur_id) VALUES ($1, $2, $3) RETURNING id;', [match[1], match[2], guild.id]) // res[1] = nom, res[2] priority
    .then (res => {
        fields.push({
            name: 'id',
            value: res.rows[0].id,
            inline: true
        });
        fields.push({
            name: 'name',
            value: match[1],
            inline: true
        });
        fields.push({
            name: 'priority',
            value: match[2],
            inline: true
        });
        return {field: fields};
    })
    .catch( err => {
        if (err.code == '23505') {
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