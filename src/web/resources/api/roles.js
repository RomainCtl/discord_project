const addrole = require('../../../command/addrole');
const delrole = require('../../../command/delrole');
const role_add = require('../../../command/role_add');
const db = require('../../../model');

function create(req, res) {
	let data = req.body;
	return addrole(['', data.name, data.priority], {id: data.guild_id}, null, null, '', null, null)
	.then(result => {
		res.setHeader('Content-Type', 'application/json');
		if ('field' in result)
			return res.status(200).end(JSON.stringify({id: result.field[1].value}));
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
		role_id = req.params.id;
	return Promise.all(
		[db.query("DELETE FROM role_cmd WHERE role_id=$1;", [role_id])].concat(
			Array.from(data.commands, cmd => role_add(['', role_id, cmd], null, null, null, '', null, null))
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
		console.error(err);
		return res.status(500).end();
	});
}

function delete_(req, res) {
	let data = req.params;
	return delrole(['', data.id], null, null, null, '', null, null)
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


module.exports = {
	create: create,
	delete: delete_,
	update: update
}