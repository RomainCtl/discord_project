const db  = require('../model');

module.exports = function(match, guild, channel, author, content, mentions, bot) {
    let fields = [{
        name: 'Commande exécuté :',
        value: content
    }];
    //On exécute une commande pour insérer un rôle dans la base de données, un rôle comprend un nom, une priorité et la guilde qu'il concerne :
    return db.query('INSERT INTO role (name, priority, serveur_id) VALUES ($1, $2, $3) RETURNING id;', [match[1], match[2], guild.id]) // res[1] = nom, res[2] priority
    .then (res => {
        //Ensuite, on affiche dans discord la réussite de la créatino du rôle en affichant dans le chat :
        //L'id du rôle donné par la base de données
        fields.push({
            name: 'id',
            value: res.rows[0].id,
            inline: true
        });
        //Le nom du rôle
        fields.push({
            name: 'name',
            value: match[1],
            inline: true
        });
        //Sa priorité 
        fields.push({
            name: 'priority',
            value: match[2],
            inline: true
        });
        //On retourne le champ :
        return {field: fields};
    })
    .catch( err => {
        //On affiche un code d'erreur spécifique en cas de problème afin de connaitre l'origine exacte de nos erreurs :
        if (err.code == '23505') {
            fields.push({
                name: 'Erreur :',
                value: err.detail
            });
            return {field: fields};
        } else {
            throw err;
        }
    });
}