const Discord = require('discord.js')
const client = new Discord.Client()


//Le bot va se connecter, mais on commence par lui donner des instructions au lancement : 
client.on('ready', () => {
    //var channel = client.channels.get(588342080737378309)
     
});

//En cas de réception de message :

client.on('message', async message => {
    //On vérifie que l'auteur n'est pas un bot, sinon nous aurions des loops :
    if(message.author.bot) return;
    //On ignore aussi les messages sans le préfix "!" :
    if(message.content.indexOf("!") !== 0) return;
    //On découpe notre commande pour comprendre le message :
    //La commande paramètre qui récupère l'ensemble de nos paramètres + la commande de départ :
    const param = message.content.slice(1).trim().split(/ +/g); //On split au niveau des espaces
    const comm = param.shift(); //On récupère la commande de l'array param dans "comm"
    
    //On lance un premier essai de discussion avec la commande : "!Hello mine turtle", le bot doit pouvoir y répondre
    if(comm === "Hello" && param.shift() === "mine" && param.shift() === "turtle"){
        message.channel.send("Hello !");
    }
});


//On donne la clé de not bot :

botToken = "NTg4MzM4NDA1MDk2Njg1NTg4.XQn3Cg.uw7DGpB4hyjKpAdVEUJxQftYGss"

//On le connecte :

client.login(botToken)