<template>
    <div>
        <form v-if="guildInfo">
            <img :src="guildInfo.discordInfo.iconURL" alt="Server Icon" class="mb-2 mr-4" style="display: inline-block; float: left; width: 64px; height: 64px;">
            <h5 class="mb-2 p-4">{{ guildInfo.discordInfo.name }}</h5>
            <div class="form-group">
                <label>Guild Prefix</label>
                <input type="text" class="form-control" name="prefix" :placeholder="guildInfo.prefix" style="width: 20%;" v-model="prefix">
                <small id="emailHelp" class="form-text text-muted">Prefix can contain a maximum of 32 characters</small>
            </div>
            <button type="submit" class="btn btn-primary" @click.prevent="update()">Update</button>
        </form>
        <router-link to="/"><a class="btn btn-primary mt-4" style="width: 100%; color: white; width: 100px;">Go back</a></router-link>
    </div>
</template>

<script>
import util from '../util/util'

export default {
    name: "ManageGuild",
    data: () => ({
        guildInfo: null,
        prefix: ""
    }),
    methods: {
        init() {
            util.connect(this).then(async () => {
                this.guildInfo = (await util.request(this, "/gqlGuild", { query: `
                {
                    guild(id: "${this.$route.params.guildId}") {
                        id,
                        prefix
                        discordInfo {
                            name,
                            iconURL
                        }
                    }
                }
                ` })).data.guild
            })
        },
        update() {
            //const instance = this;

            util.connect(this).then(async () => {
                util.request(this, "/gqlGuild", { query: `
                mutation {
                    setGuildPrefix(guildId: "${this.guildInfo.id}", prefix: "${this.prefix}")
                }
                ` }).then(() => {
                    this.init();
                    alert("Changes Saved");
                })
            })
        }
    },
    mounted() {
        this.init();
    }
}
</script>