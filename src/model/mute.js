class Mute {
    constructor () {
        this.voice_perm = {
            'PRIORITY_SPEAKER': false,
            'SPEAK': false
        };
        this.text_perm = {
            'SEND_MESSAGES': false,
            'SEND_TTS_MESSAGES': false,
            'MANAGE_MESSAGES': false,
            'ADD_REACTIONS': false
        };
    }
    mute_user(guild, user, chans) {
        // on tri les trois type de chan (ce n'est pas les memes perm a changer)
        let audio_c = chans.filter(c => c.type == 'voice');
        let text_c = chans.filter(c => c.type == 'text');
        let category_c = chans.filter(c => c.type == 'category');

        // puis on mute
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
                this.mute_user(guild, user, children);
            }),
        )
        .then( res => {
            return res;
        })
        .catch( err => {
            throw err;
        });
    }
    unmute_user(user, chans) {
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

module.exports = new Mute();