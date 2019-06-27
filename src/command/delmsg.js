const db  = require('../model');

module.exports = function(match, guild, channel, author, content, mentions, bot) {
    // match[1] => channel id
    // match[3] => duration limit
    // match[5] => user id
    let options = {};
    if (match[3] != undefined) // duration limit is specified ?
        options['limit'] = match[3];

    // avec la regex, il y a obligatoirement un channel de mentionné !
    let chan = mentions.channels.array()[0];
    if (chan.type != 'text') // on ne peut pas supprimer de message d'un channela autre que du text
        return new Promise( (resolve, reject) => {
            reject({
                name: "Erreur :",
                value: "Incompatible channel type ! (must be a text channel)"
            });
        });
    else
        return new Promise( async (resolve, reject) => {
            let fetched;
            let nb_deleted_msg = 0;
            do {
                fetched = await chan.fetchMessages({limit: 100}); // 100 is the maximum value..
                if (match[3] != undefined) { // duration limit is specified ?
                    if (match[3] > 1209600) match[3] = 1209600; // can't delete message older that 2 weeks
                    let time_limit = new Date().getTime() - match[3]*1000; // in sec
                    fetched = fetched.filter(m => m.createdTimestamp >= time_limit );
                } else {
                    let time_limit = new Date().getTime() - 1209600*1000; // in sec
                    fetched = fetched.filter(m => m.createdTimestamp >= time_limit ); // filter all message older than 2 weeks
                }
                if (match[5] != undefined)
                    fetched = fetched.filter(m => m.author.id == mentions.users.array()[0].id ); // message from specified user

                try {
                    await chan.bulkDelete(fetched);
                    nb_deleted_msg += fetched.array().length;
                } catch(err) {
                    reject({field: [
                        {
                            name: 'Command exécuté :',
                            value: content
                        },{
                            name: 'Erreur :',
                            value: err.message
                        }
                    ]});
                    return;
                }
            }
            while(fetched.size > 1);

            resolve({field: [
                {
                    name: 'Command exécuté :',
                    value: content
                },{
                    name: "Message :",
                    value: nb_deleted_msg+" messages supprimées provenant du channel <#"+chan.id+">"
                }
            ]});
        });
}