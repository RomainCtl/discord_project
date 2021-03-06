const Discord = require('discord.js');
const auth = require('../auth.json');
const cmd = require('./command');
const db  = require('./model');
const antispam = require('./anti_spam.js');
const log = require('./logger');

const client = new Discord.Client();

var timeout = null;

/**
 * Function that remove all expired sanctions and that create timeout to the next sanctions to remove
 */
function auto_remove_sanction() {
    if (timeout != null) client.clearTimeout(timeout);
    db.query("SELECT id, serveur_id FROM sanction WHERE date + duration *interval'1 second' < now()")
    .then( res => {
        // retirer toutes les sanctions terminées
        for (let i=0 ; i<res.rowCount ; i++) {
            let id = res.rows[i].id;
            let guild = client.guilds.get(res.rows[i].serveur_id);
            require('./command/cancel')(['', id], guild, null, null, '!cancel '+id, null, null);
        }

        // set timeout before cancel next sanction
        return db.query("SELECT EXTRACT(EPOCH FROM date + duration *interval'1 second' -now()) AS delay FROM sanction WHERE duration IS NOT NULL ORDER BY (date + duration *interval'1 second') DESC LIMIT 1;");
    })
    .then( res => {
        if (res.rowCount == 1)
            timeout = client.setTimeout(auto_remove_sanction, res.rows[0].delay);
    })
    .catch( err => {
        console.log("============= TimeOut Error =============");
        console.log(err);
        timeout = client.setTimeout(auto_remove_sanction, 5000); // on error wait 5 sec and redo it..
    });
}

/**
 * Event triggered when bot is OP
 */
client.on('ready', () => {
    client.user.setActivity(`on ${client.guilds.size} servers`);
    console.log("Bot is connected");

    // init antispam
    antispam(client, { // FIXME may config it on panel ? (and stock in DB)
        warnBuffer: 3,
        maxBuffer: 10,
        interval: 2000,
        maxDuplicatesWarning: 7,
        maxDuplicatesBan: 10,
    });

    // settimeout pour la prochaine sanction a retirer, reset a chaque commande (si une nouvelle sanction est cree)
    auto_remove_sanction();
});

/**
 * Event triggered when bot join new guild
 */
client.on("guildCreate", guild => {
    client.user.setActivity(`on ${client.guilds.size} servers`);
    // le bot rejoint une guild
    console.log("Joined a new guild: " + guild.name +" | "+ guild.id);

    // insert or update serveur (guild)
    db.query('INSERT INTO serveur VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET owner_id = $2;', [guild.id, guild.ownerID])
    .then (res => {
        console.log(res);
    })
    .catch( err => {
        console.log("Impossible d'ajouter le serveur "+guild.name+" ("+guild.id+") ! ");
        console.log(err.stack);
    });
});

/**
 * Event triggered when bot leave a guild
 */
client.on("guildDelete", guild => {
    client.user.setActivity(`on ${client.guilds.size} servers`);
    // le bot est supprimer d'une guild
    console.log("Left a guild: " + guild.name +" | "+ guild.id);

    db.query('DELETE FROM serveur WHERE id=$1;', [guild.id])
    .then (res => {
        console.log(res);
    })
    .catch( err => {
        console.log("Impossible de supprimer le serveur "+guild.name+" ("+guild.id+") ! ");
        console.log(err.stack);
    });
});

/**
 * Event triggered when message is deleted on channel
 */
client.on('messageDelete', msg => {
    if (msg.author.bot) return; // it's a bot
    db.query('SELECT log_channel FROM serveur WHERE id=$1;', [msg.guild.id])
    .then(res => {
        if (res.rowCount == 1) {
            let log_channel = client.channels.get(res.rows[0]['log_channel']);
            let fields =  [{
                name: 'Le Message :',
                value: "\""+msg.content+"\"\n a été supprimer du channel <#"+msg.channel.id+">!"
            }];
            log(log_channel, fields, msg.author.username, msg.author.avatarURL);
        }
    }).catch(console.log);
});

/**
 * Event triggered when message is updated
 */
client.on('messageUpdate', (old_msg, new_msg) => {
    if (new_msg.author.bot) return; // it's a bot
    db.query('SELECT log_channel FROM serveur WHERE id=$1;', [old_msg.guild.id])
    .then(res => {
        if (res.rowCount == 1) {
            let log_channel = client.channels.get(res.rows[0]['log_channel']);
            let fields =  [{
                name: 'Le Message :',
                value: "\""+old_msg.content+"\"\n du channel <#"+new_msg.channel.id+"> a été modifié en \""+new_msg.content+"\" !"
            }];
            log(log_channel, fields, new_msg.author.username, new_msg.author.avatarURL);
        }
    }).catch(console.log);
});

/**
 * Event triggered when message was send on channel
 */
client.on('message', msg => {
    if (msg.author.bot) return; // it's a bot
    var log_channel = null;
    db.query('SELECT log_channel FROM serveur WHERE id=$1;', [msg.guild.id])
    .then(res => {
        if (res.rowCount == 1) log_channel = client.channels.get(res.rows[0]['log_channel']);

        //On vérifie d'abord que le message n'est pas issu d'un floodeur :
        client.emit('checkMessage', msg, log_channel);

        if (msg.content.substring(0,1) != '!') return; // it's not a command

        console.log({command: msg.content});

        return cmd.check_and_run(msg.guild, msg.channel, msg.author, msg.content, msg.mentions, client.user);
    })
    .then( res => {
        if ('field' in res)
            log(log_channel, res.field, msg.author.username, msg.author.avatarURL);

        // settimeout pour la prochaine sanction a retirer, reset a chaque commande (si une nouvelle sanction est cree)
        auto_remove_sanction();
    })
    .catch( err => {
        if ('field' in err)
            log(log_channel, err.field, msg.author.username, msg.author.avatarURL);

        // settimeout pour la prochaine sanction a retirer, reset a chaque commande (si une nouvelle sanction est cree)
        auto_remove_sanction();
    });
});


/* Run bot (login to Discord API) */
client.login(auth.token);
