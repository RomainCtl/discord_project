const config = require('../config');
const fetch = require('node-fetch');
const btoa = require('btoa');
const Cookies = require('cookies');

/**
 * Discord login callback
 */
module.exports = function(req, res) {
    if (!req.query.code) throw new Error('NoAuthCode'); // means that user cancel authorization to use his token
    let cookies = new Cookies(req, res);

    let code = req.query.code;
    // get token
    fetch(`${config.discord_base_api}oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${config.redirect}`,
        {
            method: 'POST',
            headers: {
                Authorization: 'Basic '+ btoa(`${config.auth.client_id}:${config.auth.client_secret}`),
            },
        }
    ).then( response => {
        return response.json();
    }).then( json => {
        cookies.set('access_token', json.access_token);
        cookies.set('refresh_token', json.refresh_token);
        res.redirect(301, `/login/${json.access_token}`);
    }).catch( err => {
        throw err;
    });
}