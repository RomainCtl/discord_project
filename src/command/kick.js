const db  = require('../model');

module.exports = function(res, guild, channel, author, content, mentions) {
    // client param is db client
    console.log("it's a kick");
    // TODO

    //On récupère l'utilisateur de res :
    var cible = Client.fetchUser(res[1]);
    // 
    const member = guild.member(cible);
    if(member){
        member.kick(res[3]).then(() => {
            // We let the message author know we were able to kick the person
            message.reply('Successfully kicked ${user.tag}');
          }).catch(err => {
            // An error happened
            // This is generally due to the bot not being able to kick the member,
            // either due to missing permissions or role hierarchy
            message.reply('I was unable to kick the member');
            // Log the error
            console.error(err);
          });
    }
    else {
        message.reply('L\'utilisateur n\'est pas dans la guilde !');
    }

    return {};
}