const db  = require('../model');

// FIXME remove role from victim (ex: mute etc... (add this role to db ?))

module.exports = function(res, guild, channel, author, content, mentions, bot) {
    return db.query('DELETE FROM sanction WHERE id=$1 RETURNING *', [res[1]]) // res[1] = id with regex
    .then (res => {
        let fields = [{
            name: 'Commande exécuté :',
            value: content
        }];
        if (res.rowCount == 0) {
            // nothing to delete
            fields.push({
                name: 'Message :',
                value: "Sanction innexistante !"
            });
            return {field: fields};
        } else {
            // display deleted sanctions
            for (let key in res.rows[0])
                fields.push({
                    name: key,
                    value: res.rows[0][key],
                    inline: true
                });
            return {field: fields};
        }
    })
    .catch( err => {
        throw err;
    });
}