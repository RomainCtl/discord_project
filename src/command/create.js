const db  = require('../model');
const NumberRegexCreation = require('../util/number_regex_creation');
const ChanListRegexCreation = require('../util/chan_list_regex_creation');

var number_regex_creation = new NumberRegexCreation(); // to create regex from "<[entier]" or ">[entier]"
var chan_list_regex_creation = new ChanListRegexCreation(); // to create regex from ""

const user = "<@\!?([0-9]+)>";
const reason = "((?:(?!-d|-c).)+)";

module.exports = function(match, guild, channel, author, content, mentions) {
    let type = match[1], // ban, kick or ...
        duration_restriction = match[3], // <[entier] or >[entier] (or undefined)
        channels_restriction = match[6]; // IN [list] or NOT IN [list] (or undefined)

    let cmd_regex = "", cmd_tips = "";

    if (type == "kick" && duration_restriction != undefined) {
        // situation normalement impossible (pas de durée pour un kick)
        return new Promise( (resolve, reject) => {
            reject(
                {field: [{
                    name: 'Command exécuté :',
                    value: content
                },
                {
                    name: 'Erreur :',
                    value: "Un 'kick' ne peut pas avoir de restriction sur la durée !"
                }]}
            );
        });
    }

    // specific traitement for *kick* creation
    if (type == "kick")
        cmd_regex = "^!"+type+"[ ]+"+user+"[ ]+"+reason+"("+chan_list_regex_creation.create_regex(channels_restriction)+")?[ ]*$";
    else
        cmd_regex = "^!"+type+"[ ]+"+user+"[ ]+"+reason+"("+number_regex_creation.create_regex(duration_restriction)+")?("+chan_list_regex_creation.create_regex(channels_restriction)+")?[ ]*$";

    // update value for cmd_tips
    if (duration_restriction == undefined) duration_restriction = "";
    if (channels_restriction == undefined) channels_restriction = "list";

    if (type == "kick")
        cmd_tips = "!"+type+" @<user> <reason:text> [-c <channel: "+channels_restriction+">]";
    else
        cmd_tips = "!"+type+" @<user> <reason:text> [-d <duration: time(sec)"+duration_restriction+">, -c <channel: "+channels_restriction+">]";

    return db.query('INSERT INTO command (command, regex, serveur_id) VALUES ($1, $2, $3) RETURNING id;', [cmd_tips, cmd_regex, guild.id])
    .then( res => {
        let fields = [
            {
                name: 'Command exécuté :',
                value: content
            },
            {
                name: 'Message :',
                value: "Commande créé avec succès !"
            },
            {
                name: "id",
                value: res.rows[0]['id'],
                inline: true
            },
            {
                name: "command",
                value: cmd_tips,
                inline: true
            }
        ];
        return {field: fields};
    })
    .catch( err => {
        throw err;
    });
}