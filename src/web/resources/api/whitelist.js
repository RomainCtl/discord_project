const db = require('../../../model');

module.exports = function(req, res) {
	return db.query('DELETE FROM panel_white_list WHERE serveur_id=$1;', [req.params.guild])
	.then( () => {
		return Promise.all(
			Array.from(req.body.users_id, id => db.query('INSERT INTO panel_white_list VALUES ($1, $2);', [id, req.params.guild]))
		);
	})
	.then( () => {
		return res.status(200).end();
	})
	.catch( err => {
		console.error(err);
		return res.status(500).end();
	});
}