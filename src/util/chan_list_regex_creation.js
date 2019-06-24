const channel = "<#[0-9]+>[ ]*";
const audio_channel = "\\.audio[ ]*";
const text_channel = "\\.text[ ]*";

const in_list = "(?:$1)+";
const not_in_list = "(?:(?!$1)$2)+";

function create_in(text) {
    let channel_list = text.replace(new RegExp("IN[ ]+", 'i'), "").split( new RegExp("[ ]+", 'i') );
    let result = [];
    for (let i=0 ; i<channel_list.length ; i++) {
        if (channel_list[i] == ".audio") result.push(audio_channel);
        else if (channel_list[i] == ".text") result.push(text_channel);
        else result.push(channel_list[i]+"[ ]*");
    }

    return in_list.replace('$1', result.join("|"));
}

function create_not_in(text) {
    let channel_list = text.replace(new RegExp("^NOT[ ]+IN[ ]+", 'i'), "").split( new RegExp("[ ]+", 'i') );
    let result = [];
    for (let i=0 ; i<channel_list.length ; i++) {
        if (channel_list[i] == ".audio") result.push(audio_channel);
        else if (channel_list[i] == ".text") result.push(text_channel);
        else result.push(channel_list[i]+"[ ]*");
    }

    let other_part = [channel];
    if (result.indexOf(audio_channel) < 0) other_part.push(audio_channel);
    if (result.indexOf(text_channel) < 0) other_part.push(text_channel);

    return not_in_list.replace('$1', result.join("|")).replace('$2', other_part.join("|"));
}

class ChanListRegexCreation {
    create_regex_duration(text) {
        if (text.match("^IN")) { // IN <#125> <#532> .audio  => (?:<#125>[ ]*|<#532>[ ]*|\.audio[ ]*)+
            return create_in(text);
        } else if (text.match("^NOT[ ]+IN")) { // NOT IN <#125> <#532> .text => (?:(?!<#125>[ ]*|<#532>[ ]*|\.audio[ ]*)<#[0-9]+>[ ]*|\.text[ ]*)+
            return create_not_in(text);
        } else {
            throw "bad expression";
        }
    }
}

module.exports = ChanListRegexCreation;