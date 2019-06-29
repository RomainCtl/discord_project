const fetch = require('node-fetch');
const Cookies = require('cookies');
const config = require('../config');
const db = require('../../model');

/**
 * Route to access to admin panel
 */
module.exports = function(req, res) {
    if (!req.params.serveur_id) { // need to be logged to manage guild
        res.redirect(301, '/login');
    } else {
        let guild = {
            id: null,
            name: null,
            icon: null,
            owner: null,
            log_channel: null,
            staff: {},
            roles: {},
            commands: {},
            whitelist: []
        };
        let cookies = new Cookies(req, res);
        let token = cookies.get('discord_token');

        if (token == null) res.redirect(`${config.discord_base_api}oauth2/authorize?client_id=${config.auth.client_id}&scope=identify&response_type=code&redirect_uri=${config.redirect}`);
        else {

            fetch(`${config.discord_base_api}v6/guilds/${req.params.serveur_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bot '+config.auth.token
                }
            })
            .then(response => response.json())
            .then(r_guild => {
                guild.id = r_guild.id;
                guild.name = r_guild.name;
                guild.icon = "https://cdn.discordapp.com/icons/"+r_guild.id+"/"+r_guild.icon+".png";
                guild.owner_id = r_guild.owner_id;

                return fetch(`${config.discord_base_api}users/@me`, {
                    headers: {
                        authorization: "Bearer "+token,
                    },
                });
            })
            .then( response => {
                return response.json();
            })
            .then(json => {
                guild.owner = json;
                guild.owner.avatar = "https://cdn.discordapp.com/avatars/"+guild.id+"/"+guild.owner.avatar+".png";
                return db.query('SELECT user_id FROM panel_white_list WHERE serveur_id = $1;', [guild.id]);
            })
            .then(whitelist => {
                guild.whitelist = whitelist.rows;
                return db.query('SELECT id_mod FROM staff WHERE serveur_id = $1;', [guild.id]);
            })
            .then(staff => { // get staff username and avatar from api
                return Promise.all(
                    Array.from(staff.rows, s => fetch(`${config.discord_base_api}v6/users/${s.id_mod}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bot '+config.auth.token
                        }
                    }))
                );
            })
            .then(response => {
                return Promise.all(
                    Array.from(response, r=> r.json())
                );
            })
            .then(staff => { // add staff
                for (let s in staff) {
                    guild.staff[staff[s].id] = {
                        id: staff[s].id,
                        username: staff[s].username,
                        avatar: "https://cdn.discordapp.com/avatars/"+staff[s].id+"/"+staff[s].avatar+".png",
                        roles: []
                    }
                    if (staff[s].avatar == null) guild.staff[staff[s].id].avatar = "/public/images/discord_logo_black.png";
                }
                return Promise.all(
                    Array.from(staff, s => db.query('SELECT id_mod, role_id FROM role_moderateur WHERE id_mod=$1;', [s.id]))
                );
            })
            .then(staff_role => { // add staff role
                for (let role in staff_role)
                    for (let r in staff_role[role].rows)
                        guild.staff[staff_role[role].rows[r].id_mod].roles.push(staff_role[role].rows[r].role_id);
                return db.query('SELECT id, name, priority FROM role WHERE serveur_id=$1;', [guild.id]);
            })
            .then(roles => { // add roles
                for (let r in roles.rows)
                    guild.roles[roles.rows[r].id] = {
                        id: roles.rows[r].id,
                        name: roles.rows[r].name,
                        priority: roles.rows[r].priority,
                        commands: []
                    }
                return Promise.all(
                    Array.from(roles.rows, r => db.query('SELECT role_id, cmd_id FROM role_cmd WHERE role_id=$1;', [r.id]))
                );
            })
            .then(role_cmd => { // add cmds role
                for (let cmd in role_cmd)
                    for (let r in role_cmd[cmd].rows)
                        guild.roles[role_cmd[cmd].rows[r].role_id].commands.push(role_cmd[cmd].rows[r].cmd_id);

                return db.query('SELECT log_channel FROM serveur WHERE id = $1;', [guild.id]);
            })
            .then(serv => { // add log channel
                guild.log_channel = serv.rows[0].log_channel;
                return db.query('SELECT * FROM command WHERE serveur_id = $1 OR serveur_id IS NULL;', [guild.id]);
            })
            .then(cmds => { // add commandes
                for (let c in cmds.rows)
                    guild.commands[cmds.rows[c].id] = {
                        id: cmds.rows[c].id,
                        command: cmds.rows[c].command,
                        regex: cmds.rows[c].regex
                    };
                console.log(guild);
                res.render('index', { title: 'Administration Panel', page_to_include: './components/manage', guild: guild });
            })
            .catch(err => {
                throw err;
            });
        }
    }
}