const Discord = require('discord.js');
const auth = require('../auth.json');
const cmd = require('./command');
const db  = require('./model');

const client = new Discord.Client();

const defaultEmbed = {
	color: 0x0099ff,
	title: 'Alfred',
    url: 'http://localhost/bot_panel',
    author: {},
	description: 'Bot modération',
	fields: [],
	timestamp: new Date()
};
const default_log_embed = {
	color: 0x0099ff,
	title: 'Alfred',
	url: 'http://localhost/bot_panel',
	fields: [
		{
			name: 'Commande exécuté :',
			value: ''
        },
        {
			name: 'Message :',
			value: ''
		}
	],
	timestamp: new Date(),
	footer: {
		text: 'Merci de votre confiance',
		icon_url: '',
	}
};

function log(channel, fields, author_name, author_avatar){
    if (channel == null) return;
    default_log_embed.fields = fields;
    default_log_embed.author = {name: author_name, icon_url: author_avatar}
    channel.send({embed: default_log_embed});
}

client.on('ready', () => {
    client.user.setActivity(`on ${client.guilds.size} servers`);
    console.log("Bot is connected");
});

client.on("guildCreate", guild => {
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

client.on("guildDelete", guild => {
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


client.on('message', msg => {
    if (msg.author.bot) return; // it's a bot
    var log_channel = null;
    // get log channel if exist
    db.query('SELECT log_channel FROM serveur WHERE id=$1;', [msg.guild.id])
    .then(res => {
        if (res.rowCount == 1) log_channel = client.channels.get(res.rows[0]['log_channel']);
    }).catch();

    // TODO check si l'author est sanctionne et agir en consequence ! (s'il est mute ...)
    if (msg.content.substring(0,1) != '!') return; // it's not a command

    console.log({command: msg.content});

    // une commande est envoyé sur le serveur (guild) par un joueur
    cmd.check_and_run(msg.guild, msg.channel, msg.author, msg.content, msg.mentions, client.user)
    .then( res => {
        console.log(res);
        if ('field' in res) {
            defaultEmbed.fields = res.field;
            msg.author.send({ embed: defaultEmbed });
            log(log_channel, res.field, msg.author.username, msg.author.avatarURL);
        }
    })
    .catch( err => {
        console.log(err);
        if ('field' in err) {
            defaultEmbed.fields = err.field;
            msg.author.send({ embed: defaultEmbed });
            log(log_channel, res.field, msg.author.username, msg.author.avatarURL);
        }
    });

    // TODO create setTimeOut() pour la prochaine sanct, reado on each command
});

client.login(auth.token);
