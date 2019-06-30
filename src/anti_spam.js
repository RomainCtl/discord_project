//PRINCIPE :
//L'antispam check les message envoyé sur le channel, si un utilisateur envoi trop de message
//à la suite dans un court intervalle alors il s'agit d'un spammer.
//Le spammer reçoit un avertissement du bot en premier lieu.
//En revanche s'il a deja ete averti (une ou plusieurs fois)
//il est automatiquement bannis par le bot.

const log = require('./logger');
const ban = require('./command/ban');
const warn = require('./command/warn');
const delmsg = require('./command/delmsg');
const insult = require('./insult')

var authors = [];
var warned = [];
var banned = [];
var messageLog = [];
var motsInterdit = ['connard','abruti','idiot','fils de pute','fdp','tg','ips'];

// TODO upgrade to anti-flood ! (just check one message and percentage of the same letters (40% ?))
// TODO upgrade to anti-insult and vulgar words !

module.exports = async (client, options) => {
    /* Option Definitions */

    const warnBuffer = (options && options.warnBuffer) || 3; // Par défaut : 3
    const maxBuffer = (options && options.maxBuffer) || 20; // Par défaut : 20
    const interval = (options && options.interval) || 1000; //Par défaut : 1000 ms (1s)
    const warningMessageSpam = "Attention, il est interdit de spam sur ce serveur !";
    const warningMessageInsulte = "Attention, il est interdit d'insulter sur ce serveur !";
    const banMessageSpam = "Vous venez d'être ban automatiquement pour spam !";
    const banMessageInsulte = "Vous venez d'être ban automatiquement pour être une personne très malpolie !";
    const maxDuplicatesWarning = (options && options.maxDuplicatesWarning || 7); // Par défaut : 7
    const maxDuplicatesBan = (options && options. maxDuplicatesBan || 10); // Par défaut : 10

    // Custom 'checkMessage' event that handles messages
    client.on("checkMessage", async (message, log_channel) => {

        // permet de reutiliser les functions defini pour les commandes et utilisant les objets de discord.js
        class MyArray {
            constructor(list) {
                this.list = list;
            }
            array() {
                return this.list;
            }
        }

        // Ban the User
        const banUser = async (m, banMessage) => {
            banned.push(m.author.id);
            Promise.all([
                ban(
                    ['', '', banMessage, undefined, undefined, undefined],
                    m.guild,
                    m.channel,
                    client.user,
                    'Ban automatique <@'+m.author.id+'>',
                    {users: new MyArray([m.author])},
                    null
                ),
                delmsg(
                    ['', m.channel.id, '', interval*banUser, '', m.author.id],
                    null,
                    null,
                    null,
                    'Delmsg automatique (spam de <@'+m.author.id+'>)',
                    {channels: new MyArray([m.channel])},
                    null
                )
            ])
            .then(res => {
                let fields = [];
                for (let i in res)
                    if ('field' in res[i])
                        fields = fields.concat(res[i].field);
                log(log_channel, fields, client.user.username, client.user.avatarURL);
            })
            .catch(err => {
                if ('field' in err)
                    log(log_channel, err.field, client.user.username, client.user.avatarURL);
            });
        }

        // Warn the User
        const warnUser = async (m, warningMessage) => {
            warned.push(m.author.id);
            Promise.all([
                warn(
                    ['', '', warningMessage],
                    null,
                    null,
                    client.user,
                    'Warn automatique <@'+m.author.id+'>',
                    {users: new MyArray([m.author])},
                    null
                ),
                delmsg(
                    ['', m.channel.id, '', interval*warnBuffer, '', m.author.id],
                    null,
                    null,
                    null,
                    'Delmsg automatique (spam de <@'+m.author.id+'>)',
                    {channels: new MyArray([m.channel])},
                    null
                )
            ])
            .then(res => {
                let fields = [];
                for (let i in res)
                    if ('field' in res[i])
                        fields = fields.concat(res[i].field);
                log(log_channel, fields, client.user.username, client.user.avatarURL);
            })
            .catch(err => {
                if ('field' in err)
                    log(log_channel, err.field, client.user.username, client.user.avatarURL);
            });
        }

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
            // FIXME utiliser de regex
            if (messageLog[i].message == message.content && (messageLog[i].author == message.author.id) && (message.author.id !== client.user.id)) {
                msgMatch++;
            }
        }

        //On averti l'utilisateur qu'il est interdit de spam si cela na pas deja ete fait
        if (msgMatch == maxDuplicatesWarning && !warned.includes(message.author.id)) {
            warnUser(message, warningMessageSpam);
        }

        //Si il y a trop de spam on banni l'utilisateur
        if (msgMatch == maxDuplicatesBan && !banned.includes(message.author.id)) {
            banUser(message, banMessageSpam);
        }

        var matched = 0;

        //On vérifie le spam :
        for (var i = 0; i < authors.length; i++) {
            if (authors[i].time > currentTime - interval) { // temps entre les messages de la meme personne trop court (interval)
                matched++;
                if (matched == warnBuffer && !warned.includes(message.author.id)) {
                    warnUser(message, warningMessageSpam);
                } else if (matched == maxBuffer) {
                    if (!banned.includes(message.author.id)) { // ne pas le rebannir s'il est deja ban (le temps que le tableau soit vidée, il peut etre detecté comme encore en trein de spam)
                        banUser(message, banMessageSpam);
                    }
                }
            } else if (authors[i].time < currentTime - interval) {
                // on supprime les messages qui ne correspondent pas à du spam (pas de resemblance et trop ecarté)
                authors.splice(i);
                warned.splice(warned.indexOf(authors[i]));
                banned.splice(warned.indexOf(authors[i]));
            }

            if (messageLog.length >= 200) {
                messageLog.shift(); // supprime
            }
        }


        // FIXME a revoir, c'est pas du tout opti ca^^ (ca bouffe les ressources de ton serv de parcourir une liste aussi grande...)
        //On vérifie les insultes en comparant à une liste d'insulte :
        // console.log("Insulte ?");
        // for (var j = 0; j < insult.length; i++) {
        //     if (message.content.includes(insult[j])) {

        //         if (!warned.includes(message.author.id)) {
        //             warnUser(message, warningMessageInsulte);
        //         } else if (!banned.includes(message.author.id)) { // ne pas le rebannir s'il est deja ban (le temps que le tableau soit vidée, il peut etre detecté comme encore en trein de spam)
        //             banUser(message, banMessageInsulte);
        //         }
        //     console.log("Insulte détecté : "+insult[j]);
        //     break;
        //     }
        // }
    });
}