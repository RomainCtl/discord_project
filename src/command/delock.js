const db  = require('../model');
const lock = require('../model/roles/lock');

module.exports = function(match, guild, channel, author, content, mentions, bot) {
    //On change la persmission des channels pour les deverrouiller:

    let guild_channels = Array.from(guild.channels.values());
    let match_chan = match[1].split(new RegExp('[ ]+', 'i'));

    // ne prendre que les channels concernés
    guild_channels = guild_channels.filter( chan => {
        for (let i=0 ; i<match_chan.length ; i++)
            if ((match_chan[i] == ".audio" && chan.type == "voice") || match_chan[i] == '<#'+chan.id+'>' || (match_chan[i] == ".text" && chan.type == "text") )
                return true;
        return false;
    });

    return Promise.all(Array.from(guild_channels, c => {
        return lock.create_if_not_exist(guild, bot)
        .then( () => {
            return lock.delock_channel(c);
        });
    }))
    .then( res => {
        let result = [];
        for (let i in res)
            result = result.concat(res[i]);
        return {field: result};
    })
    .catch( err => {
        throw err;
    });
}