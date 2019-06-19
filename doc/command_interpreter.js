'use strict';

class command {
    constructor(cmd, user, reason, duration=0, channels="") {
        this.cmd = cmd;
        this.user = user;
        this.reason = reason;
        this.duration = duration;
        this.channels = channels;
    }

    static interprete(str) {
        for (let key in interpreter) {
            let test = str.match(interpreter[key]);
            if (test != null) console.log(str, test);
            else console.log(str, "NOT FOUND");
        }
    }
};

var interpreter = {
    // "sanction": new RegExp("^!(ban|kick|mute|deaf|warn)[ ]+@([^ ]+)[ ]+((?:(?!-d|-c).)+)(-d[ ]+([0-9]+))?([ ]*-c[ ]+([a-z0-9,.*]+))?[ ]*$", 'i'),
    "create_custom": new RegExp("^!create (ban|kick|deaf|mute)[ ]+(-d[ ]+(<|>)[ ]*([0-9]+))?([ ]*-c[ ]+((NOT[ ]+)?IN)[ ]+([0-9a-z,.*]+))?[ ]*$", 'i'),
    // "test1": new RegExp("^!ban[ ]+@([^ ]+)[ ]+((?:(?!-d|-c).)+)(-d[ ]+(3600|3[0-5][0-9]{2}|[0-2][0-9]{3}|[0-9]{0,3}))?([ ]*-c[ ]+(?:(chan1|chan2|\\*general|,))+)?[ ]*$", 'i'),
    //"test2": new RegExp("^!ban[ ]+@([^ ]+)[ ]+((?:(?!-d|-c).)+)(-d[ ]+(3[6-9][0-9]{2}|[0-9]{4,}))?([ ]*-c[ ]+(?:(?!chan1|chan2|\\*general)[0-9a-z,.*])+)?[ ]*$", 'i')
    // 'kick': new RegExp('^!deaf[ ]+@([^ ]+)[ ]+((?:(?!-d|-c).)+)(-d[ ]+([0-9]+))?([ ]*-c[ ]+([a-z0-9,.*]+))?[ ]*$', 'i')
};

// faire un algo qui prend en entré un entier, et en return une regex :
// <3600 => "(3600|3[0-5][0-9]{2}|[0-2][0-9]{3}|[0-9]{0,3})"
// >3600 => "(3[6-9][0-9]{2}|[0-9]{4,})"
// et un autre pour :
// IN (chan1,chan2,*general)  => (?:(chan1|chan2|\\*general|,))+
// NOT IN (chan1,chan2,*general) => (?:(?!chan1|chan2|\\*general)[0-9a-z,.*])+

var cmd = [
    // "!ban @user1 parce que",
    // "!ban @user2 pourquoi pas -d 75 -c .audio",
    // "!ban @user2 pourquoi pas -c audio",
    "!create ban -c IN chan1,chan2,.audio",
    "!create ban -d <60 -c NOT IN chan1,.audio",
    "!create ban -d > 60 ",
    // "!ban @user reasontext -d 3600",
    // "!ban @user reasontext -d 9999 -c chan3",
    // "!ban @user reasontext -d 99999 -c chan3,*general",
    // "!ban @user reasontext -d 26353 -c chan1,chan3"
    // "!deaf @user some reasons idk -d 6000 -c test"
];


for (let i=0 ; i<cmd.length ; i++) {
    let current = cmd[i];
    command.interprete(current);
}