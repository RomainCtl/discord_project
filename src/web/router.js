const express = require('express');
const router = express.Router();

// import route func
const home = require('./resources/home');
const discord_callback = require('./resources/discord_callback');
const login = require('./resources/login');
const manage = require('./resources/manage');

const guild = require('./resources/api/guild');
const whitelist = require('./resources/api/whitelist');
const roles = require('./resources/api/roles');
const staff = require('./resources/api/staff');

/**
 * Middleware that log each request with date
 */
router.use( (req, res, next) => {
    console.log(new Date(Date.now()).toLocaleString(), "::", req.method, "http://"+req.headers.host+req.originalUrl);
    next(); // go to next func (route)
});

// to parse body
router.use(express.json());

/**
 * Define routes
 */
router.get('/',                     (req, res) => { res.redirect(301, '/home'); }); // redirect /home
router.get('/home',                 home);
router.get('/manage/:serveur_id?',  manage);
router.get('/login/:token?',        login);
router.get('/discord/callback',     discord_callback);

/**
 * API routes
 */
router.put('/api/guild/:guild',         guild); // log_channel: ''
router.put('/api/whitelist/:guild',     whitelist); // users_id: []
router.put('/api/staff/:guild/:id',     staff.update); // staff: {}, guild_id: ''
router.put('/api/roles/:id',            roles.update); // roles: {}
router.put('/api/commands/:guild/:id',  );
router.post('/api/staff',               staff.create); // staff: {}
router.post('/api/roles',               roles.create); // guild_id: '', name: '', priority: ''
router.post('/api/commands',            );
router.delete('/api/staff/:guild/:id',  staff.delete); // guild_id:'', id:''
router.delete('/api/roles/:id',         roles.delete); // id: ''

// export router
module.exports = router;