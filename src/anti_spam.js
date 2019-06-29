
//PRINCIPE : 
//L'antispam check les message envoyé sur le channel, si un utilisateur envoi trop de message
//à la suite dans un court intervalle alors il s'agit d'un floodeur.
//Le floodeur reçoit un warning du bot si il ne floode pas au dessus d'une limite et qu'il n'a pas 
//floodé avant. En revanche s'il floode bien trop, ou qu'il a déjà reçu plusieurs warning de flood
//il est bannis par le bot.

var authors = [];
var warned = [];
var banned = [];
var messageLog = [];

module.exports = async (client, options) => {
  /* Option Definitions */
  
  const warnBuffer = (options && options.warnBuffer) || 3; // Default Value: 3
  const maxBuffer = (options && options.maxBuffer) || 20; // Default Value: 20
  const interval = (options && options.interval) || 1000; //Default Time: 2000MS (2 Seconds in Miliseconds)
  const warningMessage = (options && options.warningMessage) || "Attention, arrête de flood ou il y aura des conséquences..."; 
  const banMessage = (options && options.banMessage) || "has been hit by ban hammer for spamming!"; 
  const maxDuplicatesWarning = (options && options.maxDuplicatesWarning || 7); // Default Value: 7
  const maxDuplicatesBan = (options && options. maxDuplicatesBan || 10); // Deafult Value: 7
  

  
  // Custom 'checkMessage' event that handles messages
 client.on("checkMessage", async (message) => {
 
  // Ban the User
  const banUser = async (m, banMsg) => {
    
  
      banned.push(m.author.id);
      message.content = `!warn <@!${message.author.id}> ${banMsg}`;
      message.author = client.user;
      
  }
  
    
   // On warn l'utilisateur :
   const warnUser = async (m, reply) => {
    warned.push(m.author.id);
    message.content = `!warn <@!${message.author.id}> ${reply}`;
    message.author = client.user;
   }
   
    //On vérifie que l'auteur n'est pas le bot (on ne veut pas que le bot se ban lui même)
    if (message.author.id !== client.user.id) {
      //On récupère la date du message avant de l'envoyer dans un array authors qui contient le message et son auteur
      let currentTime = Math.floor(Date.now());
      authors.push({
        "time": currentTime,
        "author": message.author.id
      });
      
      //On emploi aussi un messageLog
      messageLog.push({
        "message": message.content,
        "author": message.author.id
      });
      
      let msgMatch = 0;
      //On pense à vérifier si chaque message log correspond bien à un author
      for (var i = 0; i < messageLog.length; i++) {
        if (messageLog[i].message == message.content && (messageLog[i].author == message.author.id) && (message.author.id !== client.user.id)) {
          msgMatch++;
        }
      }
      
      //On donne une chance à l'utilisateur tant qu'il n'a jamais été signalé pour flood
      if (msgMatch == maxDuplicatesWarning && !warned.includes(message.author.id)) {
        warnUser(message, warningMessage);
      }

      //Si il y a trop de flood on banni l'utilisateur
      if (msgMatch == maxDuplicatesBan && !banned.includes(message.author.id)) {
        banUser(message, banMessage);
      }

      var matched = 0;

      //On vérifie 
      for (var i = 0; i < authors.length; i++) {
        if (authors[i].time > currentTime - interval) {
          matched++;
          if (matched == warnBuffer && !warned.includes(message.author.id)) {
            warnUser(message, warningMessage);
          } else if (matched == maxBuffer) {
            if (!banned.includes(message.author.id)) {
              banUser(message, banMessage);
            }
          }
        } else if (authors[i].time < currentTime - interval) {
          authors.splice(i);
          warned.splice(warned.indexOf(authors[i]));
          banned.splice(warned.indexOf(authors[i]));
        }

        if (messageLog.length >= 200) {
          messageLog.shift();
        }
      }
    }
  });
}