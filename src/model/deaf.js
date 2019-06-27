class Deaf {
    constructor () {
        this.voice_perm = {
            'VIEW_CHANNEL': false,
            'CONNECT': false
        };
        this.text_perm = {
            'VIEW_CHANNEL': false,
            'READ_MESSAGE_HISTORY': false
        };
    }
    deaf_user(guild, user, chans) {
        // on tri les trois type de chan (ce n'est pas les memes perm a changer)
        let audio_c = chans.filter(c => c.type == 'voice');
        let text_c = chans.filter(c => c.type == 'text');
        let category_c = chans.filter(c => c.type == 'category');

        // puis on deaf
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
                this.deaf_user(guild, user, children);
            }),
        )
        .then( res => {
            return res;
        })
        .catch( err => {
            throw err;
        });
    }
    undeaf_user(user, chans) {
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

module.exports = new Deaf();