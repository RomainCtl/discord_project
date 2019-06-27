const db  = require('../model');

module.exports = function(match, guild, channel, author, content, mentions) {
    let fields = [{
        name: 'Commande exécuté :',
        value: content
    }];
    //On accède à la base de données et on execute la fonction rankup_user afin d'augmenter le rang de l'utilisateur en paramètre
    return db.query('SELECT rankup_user($1, $2, $3);', [match[1], match[2], guild.id]) // res[1] = user, res[2] role
    .then (res => {
        //En cas de réussite on retourne :
        fields.push({
            name: 'Resultat',
            value: "<@"+match[1]+"> possède maintenant le role "+match[2]
        });
        return {field: fields};
    })
    //Sinon on retourne :
    .catch( err => {
        if (err.code == 'P0001') {
            fields.push({
                name: 'Error',
                value: err.detail
            });
            return {field: fields};
        } else {
            throw err;
        }
    });
}