const db  = require('../model');

module.exports = function(match, guild, channel, author, content, mentions, bot) {
    let user = Array.from( mentions.users )[0][1];
    let fields = [{
        name: 'Commande exécuté :',
        value: content
    }];
    //On récupère de la base de données les sanctions liées à un utilisateur sur un serveur
    return db.query('SELECT * FROM sanction WHERE victim = $1 AND serveur_id = $2;', [user.id, guild.id])
    .then( res => {
        //On crée un tableau pour afficher les résultats :
        let value = "```MD\n| id | reason | duration | date | channels | victim | author | serveur_id | s_type |\n";
        value += "|:--:|:------:|:--------:|:----:|:--------:|:------:|:------:|:----------:|:------:|\n";
       //On insère les résultats dans le tableau
        for (let i=0 ; i<res.rows.length ; i++) {
            let row = res.rows[i];
            value+= '| '+row.id+' | '+row.reason+' | '+row.duration+' | '+row.date+' | '+row.channels+' | <@'+row.victim+'> | <@'+row.author+'> | '+row.serveur_id+' | '+row.s_type+' |\n';
        }
        //On envoi les résultats :
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