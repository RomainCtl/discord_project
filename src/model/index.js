const { Client } = require('pg');
const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'ENSSAT',
    password: 'root',
    port: '5432'
});

module.exports = {
    query: (text, params) => {
        client.connect();
        let start = Date.now();

        client.query('SET search_path TO bot_moderation;'); // use bot_moderation schema

        return client.query(text, params)
        .then( res => {
            let duration = Date.now() - start;
            console.log("executed query", {text, params, duration, rows: res.rowCount});
            return res;
        })
        .catch( err => {
            let duration = Date.now() - start;
            console.log("Fail to execute query", {text, params, duration, err});
            throw err;
        });
    }
}