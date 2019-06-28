const config = require('../config');

/**
 * Route to access to admin panel
 */
module.exports = function(req, res) {
    if (!req.params.serveur_id) { // need to be logged to manage guild
        res.redirect(301, '/login');
    } else {
        res.render('index', { title: 'Administration Panel', page_to_include: './components/home' });
    }
}