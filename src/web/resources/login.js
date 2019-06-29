const fetch = require('node-fetch');
const config = require('../config');
const db = require('../../model');
const Cookies = require('cookies');

/**
 * Get all guild that user can manage
 * @param {dict} user from discord api
 */
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

/**
 * Route Login (get user guilds access)
 */
module.exports = function(req, res) {
    let cookies = new Cookies(req, res);
    let token = cookies.get('discord_token');

    if (req.params.token != undefined) {
        token = req.params.token;
        cookies.set('discord_token', token);
    }

    if (token == null) {
        // discord connection
        res.redirect(`${config.discord_base_api}oauth2/authorize?client_id=${config.auth.client_id}&scope=identify&response_type=code&redirect_uri=${config.redirect}`);
    } else {
        // get data from user (guilds data)
        fetch(`${config.discord_base_api}users/@me`, {
            headers: {
                authorization: "Bearer "+token,
            },
        })
        .then( response => {
            return response.json();
        })
        .then( json => {
            // TODO token was expired -> clear token cookie
            return get_access_guilds(json);
        })
        .then(access_guild => { // result of previous 'then'
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
                    id: guilds[g].id,
                    name: guilds[g].name,
                    icon: `https://cdn.discordapp.com/icons/${guilds[g].id}/${guilds[g].icon}.png`
                });

            if (usefull_data.length == 0) {
                console.log("No one server to manage !");
                cookies.set('discord_token', {expires: Date.now()}); // delete cookie
                res.redirect(401, config.url+":"+config.port+'/');
            } else if (usefull_data.length == 1) {
                // go to manage
                res.redirect(301, '/manage/'+usefull_data[0].id);
            } else {
                console.log(usefull_data);
                res.render('index', { title: 'Administration Panel', page_to_include: './components/guild_choose', guilds: usefull_data });
            }
        })
        .catch( err => {
            throw err;
        });
    }
}