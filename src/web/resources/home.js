const config = require('../config');

/**
 * Home page with only 2 buttons to login and to add bot on discord guild
 */
module.exports = function(req, res) {
    res.render('index', { title: 'Home', page_to_include: './components/home', invite_link: config.invite_link });
}