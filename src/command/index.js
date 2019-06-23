const db = require('../model');

const global_cmd = {
    ban: {
        id: 1,
        regex: new RegExp('^!ban[ ]+<@([0-9]+)>[ ]+((?:(?!-d|-c).)+)(-d[ ]+([0-9]+))?([ ]*-c[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+))?[ ]*$', 'i'),
        callfunc: require('./ban')
    },
    kick: {
        id: 2,
        regex: new RegExp('^!kick[ ]+<@([0-9]+)>[ ]+(.*)$','i'),
        callfunc: ''
    },
    deaf: {
        id: 3,
        regex: new RegExp('^!deaf[ ]+<@([0-9]+)>[ ]+((?:(?!-d|-c).)+)(-d[ ]+([0-9]+))?([ ]*-c[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+))?[ ]*$','i'),
        callfunc: ''
    },
    mute: {
        id: 4,
        regex: new RegExp('^!mute[ ]+<@([0-9]+)>[ ]+((?:(?!-d|-c).)+)(-d[ ]+([0-9]+))?([ ]*-c[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+))?[ ]*$','i'),
        callfunc: ''
    },
    warn: {
        id: 5,
        regex: new RegExp('^!warn[ ]+@([^ ]+)[ ]+(.*)$','i'),
        callfunc: ''
    },
    create: {
        id: 6,
        regex: new RegExp('^!create (ban|kick|deaf|mute)[ ]+(-d[ ]+(<|>)[ ]*([0-9]+))?([ ]*-c[ ]+((NOT[ ]+)?IN)[ ]+([0-9a-z,.*]+))?[ ]*$','i'),
        callfunc: ''
    },
    cancel: {
        id: 7,
        regex: new RegExp('^!cancel[ ]+([0-9]+)[ ]*$','i'),
        callfunc: ''
    },
    rankup: {
        id: 8,
        regex: new RegExp('^!rankup[ ]+<@([0-9]+)>[ ]+([0-9]+)[ ]*$','i'),
        callfunc: ''
    },
    derank: {
        id: 9,
        regex: new RegExp('^!derank[ ]+<@([0-9]+)>[ ]+([0-9]+)[ ]*$','i'),
        callfunc: ''
    },
    addrole: {
        id: 10,
        regex: new RegExp('^!addrole[ ]+([a-z]+)[ ]*$','i'),
        callfunc: ''
    },
    delrole: {
        id: 11,
        regex: new RegExp('^!delrole[ ]+([0-9]+)[ ]*$','i'),
        callfunc: ''
    },
    roleAdd: {
        id: 12,
        regex: new RegExp('^!role[ ]+add[ ]+([0-9]+)[ ]+([0-9]+)[ ]*$','i'),
        callfunc: ''
    },
    roleDel: {
        id: 13,
        regex: new RegExp('^!role[ ]+del[ ]+([0-9]+)[ ]+([0-9]+)[ ]*$','i'),
        callfunc: ''
    },
    getto: {
        id: 14,
        regex: new RegExp('^!getto[ ]+<@([0-9]+)>[ ]*$','i'),
        callfunc: ''
    },
    getfrom: {
        id: 15,
        regex: new RegExp('^!getfrom[ ]+<@([0-9]+)>[ ]*$','i'),
        callfunc: ''
    },
    lock: {
        id: 16,
        regex: new RegExp('^!lock[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+)[ ]*$','i'),
        callfunc: ''
    },
    delock: {
        id: 17,
        regex: new RegExp('^!delock[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+)[ ]*$','i'),
        callfunc: ''
    },
    delmsg: {
        id: 18,
        regex: new RegExp('^!delmsg[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+)[ ]*(-d[ ]+([0-9]+))?([ ]*-u[ ]+<@([0-9]+)>)?[ ]*$','i'),
        callfunc: ''
    }
}

// TODO check les custom commands (les custom ban dans le callfunc de ban etc ...)

module.exports = {
    check_and_run: (guild, channel, author, content, mentions) => {
        for (let key in global_cmd) {
            let res = content.match( global_cmd[key].regex );
            if (res != null) {
                // check permission
                return db.query('SELECT user_can_use_cmd($1, $2, $3)', [parseInt(author.id), global_cmd[key].id, parseInt(guild.id)])
                .then (res => {
                    if (res.rows[0].user_can_use_cmd)
                        return global_cmd[key].callfunc(res, guild, channel, author, content, mentions);
                    else
                        return {message: "Vous n'avez pas la permission d'executer cette commande !"};
                })
                .catch( err => {
                    throw err;
                });
            }
        }

        // return promise with reject if unknow command
        return new Promise( (resolve, reject) => {
            reject({message: "Commande inconnu !"});
        });
    }
}
