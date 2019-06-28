const express = require('express');
const router = express.Router();

// import route func
const home = require('./resources/home');
const config = require('./config');
const discord_callback = require('./resources/discord_callback');
const login = require('./resources/login');
const manage = require('./resources/manage');

/**
 * Middleware that log each request with date
 */
router.use( (req, res, next) => {
    console.log(new Date(Date.now()).toLocaleString(), "::", req.method, "http://"+req.headers.host+req.originalUrl);
    next(); // go to next func (route)
});

/**
 * Define all routes
 */
router.get('/',                     (req, res) => { res.redirect(301, '/home'); }); // redirect /home
router.get('/home',                 home);
router.get('/manage/:serveur_id?',  manage);
router.get('/login/:token?',        login);
router.get('/discord/callback',     discord_callback);

// export router
module.exports = router;