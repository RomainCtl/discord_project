const default_log_embed = {
	color: 0x0099ff,
	title: 'Alfred',
	url: 'http://localhost:4000/',
	fields: [],
	timestamp: new Date(),
	footer: {
		text: 'Merci de votre confiance',
		icon_url: '',
	}
};

/**
 * to log data on log channel
 * @param {TextChannel} channel
 * @param {Object} fields
 * @param {string} author_name
 * @param {string} author_avatar
 */
function log(channel, fields, author_name, author_avatar){
    if (channel == null) return;
    default_log_embed.fields = fields;
    default_log_embed.author = {name: author_name, icon_url: author_avatar}
    channel.send({embed: default_log_embed});
}

module.exports = log;