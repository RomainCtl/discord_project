/* Ping Pong */
const auth = require('../../auth.json');
const WebSocketClient = require('websocket').client;
const api = require('./api');

var client = new WebSocketClient();

const discord = {
    'v': 6,
    'encoding' : 'json'
};

const identity = {
    "token": auth.token,
    "properties": {
        "$os": "linux",
        "$browser": "my_library",
        "$device": "my_library"
    }
};

var me = {
    'id' :null
};

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');

    // usefull data
    var receive_data = {};
    var hearbeat_interval = 1000;
    var last_d = null; // for beat (receive_data['s'])
    var resume = {
        "token": auth.token,
        "session_id": null,
        "seq": null
    };

    function sendMessage(op_code, data) {
        let d = {
            "op": op_code,
            "d": data
        }
        connection.send(JSON.stringify(d));
    }
    function sendBeat() {
        if (connection.connected) {
            sendMessage(1, last_d);
            setTimeout(sendBeat, hearbeat_interval);
        }
    }

    function onMessage(timestamp, guild_id, channel_id, author, message, mentions) {
        if (message.substring(0, 1) == '!') {
            // it's command
            switch (message) {
                case String( message.match( new RegExp('^!ping[ ]*$', 'i') ) ):
                    api.sendMessage(channel_id, 'Pong');
                    break;
                default:
                    api.sendMessage(channel_id, "Commande inconnu !");
            }
        }
    }

    function dispatchEvent(data) {
        switch (data['t']) {
            case 'READY':
                // success connection
                resume['session_id'] = data['d']['session_id'];
                resume['seq'] = data['s'];
                me['id'] = data['d']['user']['id']; // my bot id
                break;
            case 'GUILD_CREATE':
                // our bot join guild, add on DB if not exist
                // server_id = data['d']['id']
                // owner_id = data['d']['owner_id']
                break;
            case 'MESSAGE_CREATE':
                // message was send in one guild
                onMessage(
                    data['d']['timestamp'],
                    data['d']['guild_id'],
                    data['d']['channel_id'],
                    data['d']['author'],
                    data['d']['content'],
                    data['d']['mentions']);
                break;
        }
    }

    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            receive_data = JSON.parse(message.utf8Data);
            console.log(receive_data);

            last_d = receive_data['s'];

            // Gateway opcodes that discord send
            switch (receive_data['op']) {
                case 0: // Dispatch (general, ex: guild join, event receive, ...)
                    dispatchEvent(receive_data);
                    break;
                case 1: // Heartbeat
                    console.log("Heartbeat : ping checking");
                    sendBeat();
                    break;
                case 7: // Reconnect
                    // resume
                    sendMessage(2, resume);
                    break;
                case 9: // Invalid Session
                    console.log("Invalid Session id")
                    break;
                case 10: // Hello
                    hearbeat_interval = receive_data['d']['heartbeat_interval'];
                    // send identity
                    sendMessage(2, identity);
                    // send beat each 'heartbeat_interval' time
                    sendBeat();
                    break;
                case 11: // Heartbeat ACK
                    console.log("Server reveived heartbeat");
                    break;
            }
        }
    });
});

client.connect('wss://gateway.discord.gg/?v='+discord['v']+'&encoding='+discord['encoding']);
