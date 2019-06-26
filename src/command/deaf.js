const db  = require('../model');

module.exports = function(res, guild, channel, author, content, mentions, bot) {
    // client param is db client
    console.log("it's a deaf");
    // TODO
    //On récupère l'utilisateur de res :
    var cible = Client.fetchUser(res[1]);
    const member = guild.member(cible);

    member.addRole("deaf").catch(console.error);
    return {};
}