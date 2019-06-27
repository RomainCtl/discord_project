const db  = require('../model');

// TODO remove overwrite permission on channels concerned from victim  (replacePermissionOverwrites)

module.exports = function(res, guild, channel, author, content, mentions, bot) {
    return db.query('DELETE FROM sanction WHERE id=$1 RETURNING *', [res[1]]) // res[1] = id with regex
    .then (res => {
        let fields = [{
            name: 'Commande exécuté :',
            value: content
        }];
        let victim_id = res.rows[0]['victim'];
        if (res.rowCount == 0) {
            // nothing to delete
            fields.push({
                name: 'Message :',
                value: "Sanction innexistante !"
            });
            return {field: fields};
        } else {
            switch (res.rows[0]['s_type']) {
                case 'BAN':
                    return guild.unban(victim_id)
                    .then( () => {
                        fields.push({
                            name: 'Message :',
                            value: "L'utilisateur <@"+victim_id+"> viens d'être unban !"
                        });
                        return {field: fields};
                    })
                    .catch(err => {
                        throw err;
                    });
                case 'DEAF':
                    return guild.member(victim_id).setDeaf(false)
                    .then(() =>  {
                        fields.push({
                            name: 'Message :',
                            value: "L'utilisateur <@"+victim_id+"> peut de nouveau entendre !"
                        });
                        return {field: fields};
                    })
                    .catch(err => {
                        throw err;
                    });
                case 'MUTE':
                    return guild.member(victim_id).setMute(false)
                    .then(() =>  {
                        fields.push({
                            name: 'Message :',
                            value: "L'utilisateur <@"+victim_id+"> peut de nouveau parler !"
                        });
                        return {field: fields};
                    })
                    .catch(err => {
                        throw err;
                    });
            }
        }
    })
    .catch( err => {
        throw err;
    });
}