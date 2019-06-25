const db  = require('../model');

module.exports = function(match, guild, channel, author, content, mentions) {
    let user = Array.from( mentions.users )[0][1];
    let fields = [{
        name: 'Command exécuté :',
        value: content
    }];
    return db.query('SELECT * FROM sanction WHERE victim = $1 AND serveur_id = $2;', [user.id, guild.id])
    .then( res => {
        let value = "```MD\n| id | reason | duration | date | channels | victim | author | serveur_id | s_type | discord_role |\n";
        value += "|:--:|:------:|:--------:|:----:|:--------:|:------:|:------:|:----------:|:------:|:------------:|\n";
        for (let i=0 ; i<res.rows.length ; i++) {
            let row = res.rows[i];
            value+= '| '+row.id+' | '+row.reason+' | '+row.duration+' | '+row.date+' | '+row.channels+' | <@'+row.victim+'> | <@'+row.author+'> | '+row.serveur_id+' | '+row.s_type+' | '+row.discord_role+" |\n";
        }
        fields.push({
            name: 'Resultat :',
            value: value+"```"
        });
        return {field: fields};
    })
    .catch( err => {
        throw err;
    });
}