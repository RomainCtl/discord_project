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
    
    

    console.log(message.content.substring(1,4));

    //En fonction des trois premier caractère après le message, on peut désigner quelles
    //commandes est demandé dans une série de string :

    //Ban
    if(message.content.substring(1,4) === "ban"){
        //On essaye de vérifier la possinilité de ban :
        let ban = message.toString().match(ban_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (ban != null) console.log(ban);
        else console.log(ban_regex, "NOT FOUND");
    }
    
    //Kick
    if(message.content.substring(1,4).toLowerCase() === "kic"){
        //On essaye de vérifier la possinilité de ban :
        let kick = message.toString().match(kick_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (kick != null) console.log(kick);
        else console.log(kick_regex, "NOT FOUND");
    }

    //Deaf
    if(message.content.substring(1,4).toLowerCase() === "dea"){
        //On essaye de vérifier la possinilité de ban :
        let deaf = message.toString().match(deaf_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (deaf != null) console.log(deaf);
        else console.log(deaf_regex, "NOT FOUND");
    }

    //Mute
    if(message.content.substring(1,4).toLowerCase() === "mut"){
        //On essaye de vérifier la possinilité de ban :
        let mute = message.toString().match(mute_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (mute != null) console.log(mute);
        else console.log(mute_regex, "NOT FOUND");
    }

    //Warn
    if(message.content.substring(1,4).toLowerCase() === "war"){
        //On essaye de vérifier la possinilité de ban :
        let warn = message.toString().match(warn_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (warn != null) console.log(warn);
        else console.log(warn_regex, "NOT FOUND");
    }

    //Create
    if(message.content.substring(1,4).toLowerCase() === "cre"){
        //On essaye de vérifier la possinilité de ban :
        let create = message.toString().match(create_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (create != null) console.log(create);
        else console.log(create_regex, "NOT FOUND");
    }

    //Cancel
    if(message.content.substring(1,4).toLowerCase() === "can"){
        //On essaye de vérifier la possinilité de ban :
        let cancel = message.toString().match(cancel_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (cancel != null) console.log(cancel);
        else console.log(cancel_regex, "NOT FOUND");
    }

    //rankup
    if(message.content.substring(1,4).toLowerCase() === "ran"){
        //On essaye de vérifier la possinilité de ban :
        let rankup = message.toString().match(rankup_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (rankup != null) console.log(rankup);
        else console.log(rankup_regex, "NOT FOUND");
    }

    //derank
    if(message.content.substring(1,4).toLowerCase() === "der"){
        //On essaye de vérifier la possinilité de ban :
        let derank = message.toString().match(derank_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (derank != null) console.log(derank);
        else console.log(derank_regex, "NOT FOUND");
    }

    //addrole
    if(message.content.substring(1,4).toLowerCase() === "add"){
        //On essaye de vérifier la possinilité de ban :
        let addrole = message.toString().match(addrole_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (addrole != null) console.log(addrole);
        else console.log(addrole_regex, "NOT FOUND");
    }

    //delrole
    if(message.content.substring(1,4).toLowerCase() === "del"){
        //On essaye de vérifier la possinilité de ban :
        let delrole = message.toString().match(delrole_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (delrole != null) console.log(delrole);
        else console.log(delrole_regex, "NOT FOUND");
    }

    //roleAdd
    if(message.content.substring(1,8).toLowerCase() === "roleadd"){
        //On essaye de vérifier la possinilité de ban :
        let roleAdd = message.toString().match(roleAdd_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (roleAdd != null) console.log(roleAdd);
        else console.log(roleAdd_regex, "NOT FOUND");
    }

    //roleDel
    if(message.content.substring(1,8).toLowerCase() === "roledel"){
        //On essaye de vérifier la possinilité de ban :
        let roleDel = message.toString().match(roleDel_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (roleDel != null) console.log(roleDel);
        else console.log(roleDel_regex, "NOT FOUND");
    }

    //getto
    if(message.content.substring(1,6).toLowerCase() === "getto"){
        //On essaye de vérifier la possinilité de ban :
        let getto = message.toString().match(getto_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (getto != null) console.log(getto);
        else console.log(getto_regex, "NOT FOUND");
    }

    //getfrom
    if(message.content.substring(1,8).toLowerCase() === "getfrom"){
        //On essaye de vérifier la possinilité de ban :
        let getfrom = message.toString().match(getfrom_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (getfrom != null) console.log(getfrom);
        else console.log(getfrom_regex, "NOT FOUND");
    }

    //lock
    if(message.content.substring(1,4).toLowerCase() === "loc"){
        //On essaye de vérifier la possinilité de ban :
        let lock = message.toString().match(lock_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (lock != null) console.log(lock);
        else console.log(lock_regex, "NOT FOUND");
    }

    //delock
    if(message.content.substring(1,7).toLowerCase() === "delock"){
        //On essaye de vérifier la possinilité de ban :
        let delock = message.toString().match(delock_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (delock != null) console.log(delock);
        else console.log(delock_regex, "NOT FOUND");
    }

    //delmsg
    if(message.content.substring(1,7).toLowerCase() === "delmsg"){
        //On essaye de vérifier la possinilité de ban :
        let delmsg = message.toString().match(delmsg_regex);
        //On teste la réussite du match et on l'affiche si réussite :
        if (delmsg != null) console.log(delmsg);
        else console.log(delmsg_regex, "NOT FOUND");
    }


    //On découpe notre commande pour comprendre le message :
    //La commande paramètre qui récupère l'ensemble de nos paramètres + la commande de départ :
    const param = message.content.slice(1).trim().split(/ +/g); //On split au niveau des espaces
    const comm = param.shift(); //On récupère la commande de l'array param dans "comm"
    
    //On lance un premier essai de discussion avec la commande : "!Hello mine turtle", le bot doit pouvoir y répondre
    if(comm === "Hello" && param.shift() === "mine" && param.shift() === "turtle"){
        message.channel.send("Hello !");
    }

    
    //On efface le message
    //message.channel.sendMessage("The mine turtle has come in town, ready to ruin your day on the behalf of "+message.author);
    //message.author.send('Thank you for summoning me !');

});


//La liste de nos regExp qui nous serviront à récupérer les commandes : 

var ban_regex = new RegExp('^!ban[ ]+<@([0-9]+)>[ ]+((?:(?!-d|-c).)+)(-d[ ]+([0-9]+))?([ ]*-c[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+))?[ ]*$', 'i');
var kick_regex = new RegExp('^!kick[ ]+<@([0-9]+)>[ ]+(.*)$','i');
var deaf_regex = new RegExp('^!deaf[ ]+<@([0-9]+)>[ ]+((?:(?!-d|-c).)+)(-d[ ]+([0-9]+))?([ ]*-c[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+))?[ ]*$','i');
var mute_regex = new RegExp('^!mute[ ]+<@([0-9]+)>[ ]+((?:(?!-d|-c).)+)(-d[ ]+([0-9]+))?([ ]*-c[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+))?[ ]*$','i');
var warn_regex = new RegExp('^!warn[ ]+@([^ ]+)[ ]+(.*)$','i');
var create_regex = new RegExp('^!create (ban|kick|deaf|mute)[ ]+(-d[ ]+(<|>)[ ]*([0-9]+))?([ ]*-c[ ]+((NOT[ ]+)?IN)[ ]+([0-9a-z,.*]+))?[ ]*$','i');
var cancel_regex = new RegExp('^!cancel[ ]+([0-9]+)[ ]*$','i');
var rankup_regex = new RegExp('^!rankup[ ]+<@([0-9]+)>[ ]+([0-9]+)[ ]*$','i');
var derank_regex = new RegExp('^!derank[ ]+<@([0-9]+)>[ ]+([0-9]+)[ ]*$','i');
var addrole_regex = new RegExp('^!addrole[ ]+([a-z]+)[ ]*$','i');
var delrole_regex = new RegExp('^!delrole[ ]+([0-9]+)[ ]*$','i');
var roleAdd_regex = new RegExp('^!role[ ]+add[ ]+([0-9]+)[ ]+([0-9]+)[ ]*$','i');
var roleDel_regex = new RegExp('^!role[ ]+del[ ]+([0-9]+)[ ]+([0-9]+)[ ]*$','i');
var getto_regex = new RegExp('^!getto[ ]+<@([0-9]+)>[ ]*$','i');
var getfrom_regex = new RegExp('^!getfrom[ ]+<@([0-9]+)>[ ]*$','i');
var lock_regex = new RegExp('^!lock[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+)[ ]*$','i');
var delock_regex = new RegExp('^!delock[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+)[ ]*$','i');
var delmsg_regex = new RegExp('^!delmsg[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+)[ ]*(-d[ ]+([0-9]+))?([ ]*-u[ ]+<@([0-9]+)>)?[ ]*$','i');


//On donne la clé de not bot :

botToken = "NTg4MzM4NDA1MDk2Njg1NTg4.XQn3Cg.uw7DGpB4hyjKpAdVEUJxQftYGss"

//On le connecte :

client.login(botToken)