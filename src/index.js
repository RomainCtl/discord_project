const Discord = require('discord.js');
const auth = require('../auth.json');
const cmd = require('./command');
const db  = require('./model');

const client = new Discord.Client();

const defaultEmbed = {
	color: 0x0099ff,
	title: 'Alfred',
	url: 'http://localhost/bot_panel',
	description: 'Bot modération',
	fields: [
		{
			name: 'Message :',
			value: ''
		},
		{
			name: 'Command exécuté :',
			value: ''
		}
	],
	timestamp: new Date(),
	footer: {
		text: 'Merci de votre confiance',
		icon_url: '',
	},
};

client.on('ready', () => {
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

client.on('message', msg => {
    // TODO check si l'author est sanctionne et agir en consequence ! (s'il est mute ...)
    if (msg.author.bot) return; // it's a bot
    if (msg.content.substring(0,1) != '!') return; // it's not a command

    console.log({command: msg.content});

    // une commande est envoyé sur le serveur (guild) par un joueur
    cmd.check_and_run(msg.guild, msg.channel, msg.author, msg.content, msg.mentions)
    .then( res => {
        console.log(res);
        if ('field' in res) {
            defaultEmbed.fields = res.field;
            msg.author.send({ embed: defaultEmbed });
        }
    })
    .catch( err => {
        console.log(err);
        if ('field' in err) {
            defaultEmbed.fields = err.field;
            msg.author.send({ embed: defaultEmbed });
        }
    });

    // TODO create setTimeOut() pour la prochaine sanct, reado on each command
});

client.login(auth.token);