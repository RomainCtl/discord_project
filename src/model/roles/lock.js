class Lock {
    constructor() {
        this.name = 'lock';
        this.mentionable = false;
        this.hoist = false;
        this.role = null;
        this.guild = null;

        this.voice_perm = {
            'CONNECT': false,
            'SPEAK': false,
            'MANAGE_ROLES': false // gerer les permissions de ce salon
        };
        this.text_perm = {
            'SEND_MESSAGES': false,
            'SEND_TTS_MESSAGES': false,
            'MANAGE_MESSAGES': false,
            'ADD_REACTIONS': false,
            'READ_MESSAGE_HISTORY': false,
            'MANAGE_ROLES': false // gerer les permissions de ce salon
        };
    }
    create_if_not_exist(guild, bot) {
        this.guild = guild;
        this.role = guild.roles.find('name', this.name);
        if (!this.role) {
            return guild.createRole({
                name: this.name,
                position: this.guild.member(bot).highestRole.position-1,
                mentionable: this.mentionable,
                hoist: this.hoist
            })
            .then(role => {
                console.log(`Created new role with name ${role.name} and position ${role.position}`);
                this.role = role;

                this.add_lock_role(this.guild); // ajouter le role 'lock' a tout le monde

                return;
            })
            .catch(err => {
                throw err;
            });
        } else {
            // placer a la plus haute position possible pour qu'il prenne le dessus sur les autres roles (position du role du bot-1)
            return this.role.setPosition( this.guild.member(bot).highestRole.position-1 )
            .then( res => {
                return res;
            })
            .catch(err => {
                throw err;
            });
        }
    }
    lock_channel(chan) {
        if (this.guild == null || this.role == null) {
            return new Promise( (resolve, reject) => {
                reject({
                    message: 'Always use \'create_if_not_exist\' function before use it !'
                });
            });
        } else if (chan.type == "voice") { // channel de type voice
            return chan.overwritePermissions(
                this.role,
                this.voice_perm
            ).then( chan => {
                return [{
                    name: 'Le channel de type '+chan.type,
                    value: '<#'+chan.id+'> a été verouillé avec succès !'
                }];
            }).catch( err => {
                throw err;
            });
        }
        else if (chan.type == "text") { // channel de type text
            return chan.overwritePermissions(
                this.role,
                this.text_perm
            ).then( chan => {
                return [{
                    name: 'Le channel de type '+chan.type,
                    value: '<#'+chan.id+'> a été verouillé avec succès !'
                }];
            }).catch( err => {
                throw err;
            });
        } else if (chan.type == 'category') { // si c'est une categorie (qui a donc plusieurs enfants)
            let channels = Array.from( this.guild.channels.values() );
            channels = channels.filter(c => c.parentID == chan.id); // select all children

            return Promise.all( Array.from(channels, c => this.lock_channel(c)) ) // lock them (use promise)
            .then( res => {
                let fields = []; // group each field create by promises (this function (recusrive))
                for (let i in res)
                    fields.push(res[i][0]);
                return fields;
            })
            .catch( err => {
                throw err;
            });
        } else {
            return new Promise(  (resolve, reject) => {
                reject({
                    message: 'Unknown channel type'
                });
            })
        }
    }
    add_lock_role(guild) {
        // TODO add role to every member on guild
        // TODO on member join guild -> add this role too
    }
}

module.exports = new Lock();