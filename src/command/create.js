const db  = require('../model');
const NumberRegexCreation = require('../util/number_regex_creation');
// const ChanListRegexCreation = require('../util/chan_list_regex_creation');

var number_regex_creation = new NumberRegexCreation(); // to create regex from "<[entier]" or ">[entier]"
// var chan_list_regex_creation = new ChanListRegexCreation(); // to create regex from ""

// TODO create regex !
const user = "<@\!?([0-9]+)>";
const duration = "-d[ ]+([0-9]+)";
const channel = "<#[0-9]+>[ ]*";
const audio_channel = "\.audio[ ]*";
const text_channel = "\.text[ ]*";
const inf_duration = "-d[ ]+($1)";     // <3600 => $1="3600|3[0-5][0-9]{2}|[0-2][0-9]{3}|[0-9]{,3}"
const sup_duration = "-d[ ]+($1)";     // >3600 => $1="3[6-9][0-9]{2}|[4-9][0-9]{3}|[1-9][0-9]{4,}"
const in_list = "(?:$1)+";             // IN <#125> <#532> .audio  => (?:<#125>[ ]*|<#532>[ ]*|.audio[ ]*)+
const not_in_list = "(?:(?!$1)$2)+";   // NOT IN <#125> <#532> .text => (?:(?!<#125>[ ]*|<#532>[ ]*|.audio[ ]*)<#[0-9]+>[ ]*|\.text[ ]*)+

module.exports = function(res, guild, channel, author, content, mentions) {
    // client param is db client
    console.log("it's a ban");
    // TODO

    return {};
}