const db = require('../model');

const global_cmd = {
    ban: {
        id: 1,
        regex: new RegExp('^!ban[ ]+<@\!?([0-9]+)>[ ]+((?:(?!-d|-c).)+)(-d[ ]+([0-9]+))?([ ]*-c[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+))?[ ]*$', 'i'),
        callfunc: require('./ban')
    },
    kick: {
        id: 2,
        regex: new RegExp('^!kick[ ]+<@\!?([0-9]+)>[ ]+(.*)$','i'),
        callfunc: require('./kick')
    },
    deaf: {
        id: 3,
        regex: new RegExp('^!deaf[ ]+<@\!?([0-9]+)>[ ]+((?:(?!-d|-c).)+)(-d[ ]+([0-9]+))?([ ]*-c[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+))?[ ]*$','i'),
        callfunc: require('./deaf')
    },
    mute: {
        id: 4,
        regex: new RegExp('^!mute[ ]+<@\!?([0-9]+)>[ ]+((?:(?!-d|-c).)+)(-d[ ]+([0-9]+))?([ ]*-c[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+))?[ ]*$','i'),
        callfunc: require('./mute')
    },
    warn: {
        id: 5,
        regex: new RegExp('^!warn[ ]+<@\!?([0-9]+)>[ ]+(.*)$','i'),
        callfunc: require('./warn')
    },
    create: {
        id: 6,
        regex: new RegExp('^!create (ban|kick|deaf|mute)[ ]+(-d[ ]+((<|>)[ ]*[0-9]+))?([ ]*-c[ ]+((NOT[ ]+)?IN[ ]+(<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+))?[ ]*$','i'),
        callfunc: require('./create')
    },
    cancel: {
        id: 7,
        regex: new RegExp('^!cancel[ ]+([0-9]+)[ ]*$','i'),
        callfunc: require('./cancel')
    },
    rankup: {
        id: 8,
        regex: new RegExp('^!rankup[ ]+<@\!?([0-9]+)>[ ]+([0-9]+)[ ]*$','i'),
        callfunc: require('./rankup')
    },
    derank: {
        id: 9,
        regex: new RegExp('^!derank[ ]+<@\!?([0-9]+)>[ ]+([0-9]+)[ ]*$','i'),
        callfunc: require('./derank')
    },
    addrole: {
        id: 10,
        regex: new RegExp('^!addrole[ ]+([a-z]+)[ ]+([0-9]+)[ ]*$','i'),
        callfunc: require('./addrole')
    },
    delrole: {
        id: 11,
        regex: new RegExp('^!delrole[ ]+([0-9]+)[ ]*$','i'),
        callfunc: require('./delrole')
    },
    roleAdd: {
        id: 12,
        regex: new RegExp('^!role[ ]+add[ ]+([0-9]+)[ ]+([0-9]+)[ ]*$','i'),
        callfunc: require('./role_add')
    },
    roleDel: {
        id: 13,
        regex: new RegExp('^!role[ ]+del[ ]+([0-9]+)[ ]+([0-9]+)[ ]*$','i'),
        callfunc: require('./role_del')
    },
    getto: {
        id: 14,
        regex: new RegExp('^!getto[ ]+<@\!?([0-9]+)>[ ]*$','i'),
        callfunc: require('./getto')
    },
    getfrom: {
        id: 15,
        regex: new RegExp('^!getfrom[ ]+<@\!?([0-9]+)>[ ]*$','i'),
        callfunc: require('./getfrom')
    },
    lock: {
        id: 16,
        regex: new RegExp('^!lock[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+)[ ]*$','i'),
        callfunc: require('./lock')
    },
    delock: {
        id: 17,
        regex: new RegExp('^!delock[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+)[ ]*$','i'),
        callfunc: require('./delock')
    },
    delmsg: {
        id: 18,
        regex: new RegExp('^!delmsg[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+)[ ]*(-d[ ]+([0-9]+))?([ ]*-u[ ]+<@\!?([0-9]+)>)?[ ]*$','i'),
        callfunc: require('./delmsg')
    }
}

// TODO check les custom commands (les custom ban dans le callfunc de ban etc ...) (PS: sinon elles seront prise en "inconnu" ou en ban normal)
// TODO command !help qui retourne toutes les commandes auquels on a acces

module.exports = {
    check_and_run: (guild, channel, author, content, mentions) => {
        for (let key in global_cmd) {
            let match = content.match( global_cmd[key].regex );
            if (match != null) {
                // check permission
                return db.query('SELECT user_can_use_cmd($1, $2, $3)', [author.id, global_cmd[key].id, guild.id])
                .then (res => {
                    console.log(match); // FIXME delete this
                    if (res.rows[0].user_can_use_cmd)
                        return global_cmd[key].callfunc(match, guild, channel, author, content, mentions);
                    else
                        return {field: [{
                            name: 'Command exécuté :',
                            value: content
                        },
                        {
                            name: 'Erreur :',
                            value: "Vous n'avez pas la permission d'executer cette commande !"
                        }]};
                })
                .catch( err => {
                    throw err;
                });
            }
        }

        // return promise with reject if unknow command
        return new Promise( (resolve, reject) => {
            reject({
                    field: [
                    {
                        name: 'Command exécuté :',
                        value: content
                    },
                    {
                        name: 'Erreur :',
                        value: "Commande inconnu !"
                    }
                ]
            });
        });
    }
}
