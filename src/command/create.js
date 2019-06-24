const db  = require('../model');
const NumberRegexCreation = require('../util/number_regex_creation');
const ChanListRegexCreation = require('../util/chan_list_regex_creation');

var number_regex_creation = new NumberRegexCreation(); // to create regex from "<[entier]" or ">[entier]"
var chan_list_regex_creation = new ChanListRegexCreation(); // to create regex from ""

// TODO create regex !
const user = "<@\!?([0-9]+)>";
const reason = "((?:(?!-d|-c).)+)";

module.exports = function(res, guild, channel, author, content, mentions) {
    let type = res[1], // ban, kick or ...
        duration_restriction = res[3], // <[entier] or >[entier] (or undefined)
        channels_restriction = res[6]; // IN [list] or NOT IN [list] (or undefined)

    let cmd = "^!"+type+"[ ]+"+user+"[ ]+"+reason+"("+number_regex_creation.create_regex(duration_restriction)+")?("+chan_list_regex_creation.create_regex(channels_restriction)+")?[ ]*$";

    return {command: cmd};
}