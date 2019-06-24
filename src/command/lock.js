const db  = require('../model');

module.exports = function(res, guild, channel, author, content, mentions) {
    // client param is db client
    console.log("it's a ban");
    // TODO
    //On change la persmission du channel pour le verrouiller:
    
    channel.overwritePermissions(
        "Fermer",//Il faudra rajouter un rôle Fermer pour indiquer que la chaine est fermer
        { 'SEND_MESSAGES': false },
        // optional 'reason' for permission overwrite
        'La discussion est terminé'
    )
    // handle responses / errors
    .then(console.log)
    .catch(console.log);
    return {};
}