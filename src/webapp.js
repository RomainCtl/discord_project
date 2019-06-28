const express = require('express');
const cookieParser = require('cookie-parser');
const config = require('./web/config');
const router = require('./web/router');
var app = express();

// use router
app.use('/', router);

// use cookie parser
app.use(cookieParser());

// on error, do :
app.use(function (err, req, res, next) {
    switch (err.message) {
        case 'NoAuthCode': // discord auth error
            console.log("Error: ", req.query.error_description);
            return res.status(400).end(); //?error=access_denied&error_description=The+resource+owner+or+authorization+server+denied+the+request
        default:
            console.log("Error :", err.message);
            return res.status(500).end();
    }
});

// specify public directory (assets)
app.use('/public', express.static('./src/web/public'));

app.set('views', './src/web/views'); // change default views directory
app.set('view engine', 'ejs'); // render engine

/* Launch server */
app.listen(config.port, () => {
    console.log("Server listenning on", config.url+config.port);
});