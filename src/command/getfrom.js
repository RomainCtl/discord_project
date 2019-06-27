const db  = require('../model');

module.exports = function(match, guild, channel, author, content, mentions, bot) {
    let user = Array.from( mentions.users )[0][1];
    let fields = [{
        name: 'Récupérer les sanctions attribué par un modérateur :',
        value: content
    }];
    //On va chercher dans la base de données la liste des sanctions d'un modérateur sur un serveur :
    return db.query('SELECT * FROM sanction WHERE author = $1 AND serveur_id = $2;', [user.id, guild.id])
    .then( res => {
        //On récupère les valeurs  dans un tableau qui nous permettra de les organiser avant de les afficher sur Discord :
        let value = "```markdown\n| id | reason | duration | date | channels | victim | author | serveur_id | s_type |\n";
        value += "|:--:|:------:|:--------:|:----:|:--------:|:------:|:------:|:----------:|:------:|\n";
       //On récupère les infos de la base de données et on les affiches dans le tableau :
        for (let i=0 ; i<res.rows.length ; i++) {
            let row = res.rows[i];
            value+= '| '+row.id+' | '+row.reason+' | '+row.duration+' | '+row.date+' | '+row.channels+' | <@'+row.victim+'> | <@'+row.author+'> | '+row.serveur_id+' | '+row.s_type+" |\n";
        }

        // envoie le res
        channel.send(value+"```");
        // retourne pour les logs
        return {field: fields};
    })
    .catch( err => {
        throw err;
    });
}