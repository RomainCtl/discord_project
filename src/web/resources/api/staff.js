const rankup = require('../../../command/rankup');
const db = require('../../../model');

function create(req, res) {
	let data = req.body;
	return rankup(['', data.id, data.role_id], {id: data.guild_id}, null, null, '', null, null)
	.then(result => {
		if ('field' in result)
			return res.status(200).end();
		else
			return res.status(500).end();
	})
	.catch(err => {
		console.error(err);
		return res.status(500).end();
	});
}

function update(req, res) {
	let data = req.body,
		user_id = req.params.id,
		guild_id = req.params.guild;
	return Promise.all(
		[db.query("DELETE FROM role_moderateur USING role WHERE id=role_id AND serveur_id=$2 AND id_mod=$1;", [user_id, guild_id])].concat(
			Array.from(data.roles, role => rankup(['', user_id, role], {id: guild_id}, null, null, '', null, null))
		)
	)
	.then(result => {
		for (r in result)
			if ('field' in result[r]) {
				return res.status(200).end();
			}
		return res.status(500).end();
	})
	.catch(err => {
		return res.status(500).end();
	});
}

function delete_(req, res) {
	let user_id = req.params.id,
		guild_id = req.params.guild;
	return db.query('DELETE FROM staff WHERE serveur_id=$1 AND id_mod=$2;', [guild_id, user_id]) // a trigger is call to delete all role
	.then(() => {
		return res.status(200).end();
	})
	.catch(err => {
		return res.status(500).end();
	});
}


module.exports = {
	create: create,
	delete: delete_,
	update: update
}