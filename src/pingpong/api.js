const axios = require('axios');
const auth = require('../../auth.json');

class API {
    constructor () {
        this.instance = axios.create({
            baseURL: "https://discordapp.com/api/v6",
            timeout: 1000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bot '+auth.token
            }
        });
    }
    sendMessage(channel_id, content, tts=false) {
        this.instance.post(
            'channels/'+channel_id+'/messages',
            {
                'content': content,
                'tts': tts
            })
        .then( response => {
            console.log(response.status+" POST "+response['config']['url']+"\n\tdata: "+JSON.stringify(response['config']['data']));
        })
        .catch( error => {
            console.log(error);
        });
    }
}

module.exports = new API();