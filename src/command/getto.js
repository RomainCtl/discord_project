const db  = require('../model');

module.exports = function(match, guild, channel, author, content, mentions, bot) {
    let user = Array.from( mentions.users )[0][1];
    let fields = [{
        name: 'Récupérer les sanctions d\'un joueur :',
        value: content
    }];
    //On récupère de la base de données les sanctions liées à un utilisateur sur un serveur
    return db.query('SELECT * FROM sanction WHERE victim = $1 AND serveur_id = $2;', [user.id, guild.id])
    .then( res => {
        let i=0;
        let value = "";
        while (i < res.rows.length) {
            value = "```markdown\n| id | reason | duration | date | channels | victim | author | serveur_id | s_type |\n";
            value += "|:--:|:------:|:--------:|:----:|:--------:|:------:|:------:|:----------:|:------:|\n";
            do { // message max size is 2000...
                let row = res.rows[i];
                value += '| '+row.id+' | '+row.reason+' | '+row.duration+' | '+row.date+' | '+row.channels+' | <@'+row.victim+'> | <@'+row.author+'> | '+row.serveur_id+' | '+row.s_type+' |\n';
                i++;
            } while (i<res.rows.length && value.length < 1500);
            // envoie le res (et donc plusieurs si il y a trop de ligne)
            channel.send(value+"```");
        }
        // retourne pour les logs
        return {field: fields};
    })
    .catch( err => {
        throw err;
    });
}