class Ban {
    constructor () {
        this.voice_perm = {
            'VIEW_CHANNEL': false,
            'PRIORITY_SPEAKER': false,
            'SPEAK': false,
            'CONNECT': false
        };
        this.text_perm = {
            'VIEW_CHANNEL': false,
            'SEND_MESSAGES': false,
            'SEND_TTS_MESSAGES': false,
            'MANAGE_MESSAGES': false,
            'ADD_REACTIONS': false,
            'READ_MESSAGE_HISTORY': false
        };
    }
    ban_user(guild, user, chans, options) {
        if (chans.length <= 0)
            return user.ban(options)
            .then( res => {
                return res;
            })
            .catch( err => {
                throw err;
            });
        else {
            // on tri les trois type de chan (ce n'est pas les memes perm a changer)
            let audio_c = chans.filter(c => c.type == 'voice');
            let text_c = chans.filter(c => c.type == 'text');
            let category_c = chans.filter(c => c.type == 'category');

            // puis on ban
            return Promise.all(
                Array.from(audio_c, c => {
                    c.overwritePermissions(
                        user,
                        this.voice_perm
                    )
                }),
                Array.from(text_c, c => {
                    c.overwritePermissions(
                        user,
                        this.text_perm
                    )
                }),
                Array.from(category_c, c => {
                    let children = Array.from( Array.from(guild.channels.values), ch => ch.parentID == c.id );
                    this.ban_user(guild, user, children);
                }),
            )
            .then( res => {
                return res;
            })
            .catch( err => {
                throw err;
            });
        }
    }
    unban_user(guild, user, chans) {
        if (chans.length <= 0)
            return guild.unban(user)
            .then( res => {
                return res;
            })
            .catch( err => {
                throw err;
            });
        else
            return Promise.all(
                Array.from(chans, c => {
                    c.replacePermissionOverwrites({ // replace Permission Overwrite veut dire qu'il remet les permissions par default
                        overwrites: [
                            {id: user}
                        ]
                    });
                })
            )
            .then( res => {
                return res;
            })
            .catch( err => {
                throw err;
            });
    }
}

module.exports = new Ban();