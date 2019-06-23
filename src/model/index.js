const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'ENSSAT',
    password: 'root',
    port: '5432'
});


module.exports = {
    query: (text, params) => {
        return pool.connect()
        .then(client => {
            let start = Date.now();
            client.query('SET search_path TO bot_moderation;'); // use bot_moderation schema

            return client.query(text, params)
            .then(res => {
                client.release();
                let duration = Date.now() - start;
                console.log("executed query", {text, params, duration, rows: res.rowCount});
                return res;
            })
            .catch(err => {
                client.release();
                let duration = Date.now() - start;
                console.log("Fail to execute query", {text, params, duration, err});
                throw err;
            });
        });
    }
}