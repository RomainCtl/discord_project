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


//La liste de nos regExp qui nous serviront à récupérer les commandes : 

var ban_regex = new RegExp('^!ban[ ]+<@([0-9]+)>[ ]+((?:(?!-d|-c).)+)(-d[ ]+([0-9]+))?([ ]*-c[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+))?[ ]*$', 'i');
var kick_regex = new RegExp('^!kick[ ]+<@([0-9]+)>[ ]+(.*)$','i');
var deaf_regex = new RegExp('^!deaf[ ]+<@([0-9]+)>[ ]+((?:(?!-d|-c).)+)(-d[ ]+([0-9]+))?([ ]*-c[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+)))?[ ]*$','i');
var mute_regex = new RegExp('^!mute[ ]+<@([0-9]+)>[ ]+((?:(?!-d|-c).)+)(-d[ ]+([0-9]+))?([ ]*-c[ ]+((<#[0-9]+>[ ]*|\.audio[ ]*|\.text[ ]*)+)))?[ ]*$','i');
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
var 

//On donne la clé de not bot :

botToken = "NTg4MzM4NDA1MDk2Njg1NTg4.XQn3Cg.uw7DGpB4hyjKpAdVEUJxQftYGss"

//On le connecte :

client.login(botToken)