<template>
    <div>
        <div class="alert alert-danger" role="alert" v-if="error">
            {{ error }}
        </div>

        <div class="alert alert-success" role="alert" v-if="success">
            {{ success }}
        </div>

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
        prefix: "",
        error: null,
        success: null
    }),
    methods: {
        init() {
            return new Promise(r => {
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
                    r()
                })
            })
            
        },
        update() {
            this.error = null;
            this.success = null;
            const prefix = this.prefix ? this.prefix.trim() : ""
            if(prefix.length > 32) {
                this.error = "Prefix length above 32"
                return
            }


            if(prefix === "") {
                return
            }

            this.$store.state.loading = true;
            util.connect(this).then(async () => {
                util.request(this, "/gqlGuild", { query: `
                mutation {
                    setGuildPrefix(guildId: "${this.guildInfo.id}", prefix: "${prefix}")
                }
                ` }).then(async () => {
                    await this.init();
                    this.prefix = ""
                    this.$store.state.loading = false;
                    this.success = "Changes have been saved";
                })
            })
        }
    },
    mounted() {
        this.$store.state.loading = true;
        this.init().then(() => {
            this.$store.state.loading = false;
        });
    }
}
</script>