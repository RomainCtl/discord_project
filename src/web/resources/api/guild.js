const setlogchannel = require('../../../command/setlogchannel');

module.exports = function(req, res) {
	setlogchannel(null, {id: req.params.guild}, null, null, '', {channels: [[req.body.log_channel]]}, null)
	.then(result => {
		if ('field' in result)
			return res.status(200).end();
		else
			return res.status(500).end();
	})
	.catch(err => {
		console.error(err);
		return res.status(500).end();
	})
}