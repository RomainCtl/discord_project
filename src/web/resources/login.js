const fetch = require('node-fetch');
const config = require('../config');
const db = require('../../model');

function get_access_guilds(user) {
    return db.query('SELECT serveur_id AS id FROM panel_white_list WHERE user_id=$1 UNION SELECT id FROM serveur WHERE owner_id=$1;', [user.id])
    .then(res => {
        let result = [];
        for (let r in res.rows) result.push(res.rows[r].id);
        return result;
    })
    .catch(err => {
        throw err;
    });
}

module.exports = function(req, res) {
    if (!req.params.token) {
        // discord connection
        res.redirect(`${config.discord_base_api}oauth2/authorize?client_id=${config.auth.client_id}&scope=identify&response_type=code&redirect_uri=${config.redirect}`);
    } else {
        // get data from user (guilds data)
        fetch(`${config.discord_base_api}users/@me`, {
            headers: {
                authorization: "Bearer "+req.params.token,
            },
        })
        .then( response => {
            return response.json();
        })
        .then( json => {
            return get_access_guilds(json);
        })
        .then(access_guild => { // result of previous 'then'
            console.log(access_guild);
            return Promise.all(
                Array.from(access_guild, g => fetch(`${config.discord_base_api}v6/guilds/${g}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bot '+config.auth.token
                    }
                }))
            );
        })
        .then( response => {
            return Promise.all(
                Array.from(response, re => re.json())
            );
        })
        .then(guilds => {
            let usefull_data = [];
            for (let g in guilds)
                usefull_data.push({
                    id: g.id,
                    name: g.name,
                    icon: g.icon
                });

            if (usefull_data.length == 1) {
                // go to manage
                // res.redirect(301, '/manage');
            } else {
                // choose guild
            }
        })
        .catch( err => {
            throw err;
        });
    }
}