const db  = require('../model');

module.exports = function(match, guild, channel, author, content, mentions, bot) {
    let fields = [{
        name: 'Commande exécuté :',
        value: content
    }];
    return db.query('SELECT c.command FROM command AS c WHERE serveur_id=$1 OR serveur_id IS NULL;', [guild.id])
    .then (res => {
        let cmd_help = "```markdown\n";

        console.log(res);
        for (let r in res.rows)
            cmd_help += "* "+res.rows[r].command+"\n";

        cmd_help += "```";
        channel.send(cmd_help);
        return {field: fields};
    })
    .catch( err => {
        throw err;
    });
}