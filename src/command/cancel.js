const db  = require('../model');
const deaf = require('../model/deaf');
const mute = require('../model/mute');

// TODO remove overwrite permission on channels concerned from victim  (replacePermissionOverwrites)

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
            let victim_id = res.rows[0]['victim'];
            // get channels
            let chan_list = Array.from(guild.channels.values());

            // ne prendre que les channels concernés
            let match_chan = res.rows[0]['channels'];
            if (match_chan != null) {
                match_chan = match_chan.split(new RegExp('[ ]+', 'i'));
                chan_list = chan_list.filter( chan => {
                    for (let i=0 ; i<match_chan.length ; i++)
                        if ((match_chan[i] == ".audio" && chan.type == "voice") || match_chan[i] == '<#'+chan.id+'>' || (match_chan[i] == ".text" && chan.type == "text") )
                            return true;
                    return false;
                });
            }

            // delete sanctions
            switch (res.rows[0]['s_type']) {
                case 'BAN':
                    return guild.unban(victim_id)
                    .then( () => {
                        fields.push({
                            name: 'Message :',
                            value: "L'utilisateur <@"+victim_id+"> viens d'être unban !\n *sur les channels :* "+chan_list.join(", ")
                        });
                        return {field: fields};
                    })
                    .catch(err => {
                        throw err;
                    });
                case 'DEAF':
                    return deaf.undeaf_user(victim_id, chan_list)
                    .then(() =>  {
                        fields.push({
                            name: 'Message :',
                            value: "L'utilisateur <@"+victim_id+"> peut de nouveau entendre !\n *sur les channels :* "+chan_list.join(", ")
                        });
                        return {field: fields};
                    })
                    .catch(err => {
                        throw err;
                    });
                case 'MUTE':
                    return mute.unmute_user(victim_id, chan_list)
                    .then(() =>  {
                        fields.push({
                            name: 'Message :',
                            value: "L'utilisateur <@"+victim_id+"> peut de nouveau parler !\n *sur les channels :* "+chan_list.join(", ")
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