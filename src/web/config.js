const auth = require('../../auth.json');
const discord_base_api = "https://discordapp.com/api/";
module.exports = {
    url: "http://localhost",
    port: 4000,
    auth: auth,
    discord_base_api: discord_base_api,
    invite_link: `${discord_base_api}oauth2/authorize?client_id=${auth.client_id}&permissions=8&scope=bot`,
    redirect: encodeURIComponent('http://localhost:4000/discord/callback')
}