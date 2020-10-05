<template>
    <div>
        <div class="card p-2 m-2" style="width: 16rem; float: left; background-color: ghostwhite;" v-for="guild in guilds" :key="guild.id">
            <img class="card-img-top mx-auto d-block" :src="guild.discordInfo.iconURL" style="background-color: darkgrey; height: 100px; width: 100px">
            <div class="card-body">
                <h5 class="card-title text-center">{{ guild.discordInfo.name }}</h5>
                <router-link :to="`/${guild.id}`"><a class="btn btn-primary" style="width: 100%; color: white;">Manage</a></router-link>
            </div>
        </div>
    </div>
</template>

<script>
import util from '../util/util'

export default {
    name: "Home",
    data: () => ({
        guilds: []
    }),
    mounted() {
        this.$store.state.loading = true;
        util.connect(this).then(async () => {
            this.guilds = (await util.request(this, "/gqlGuild", { query: `
            {
                guilds {
                    id
                    discordInfo {
                        name,
                        iconURL
                    }
                }
            }
            ` })).data.guilds.filter(it => !!it["discordInfo"] && !!it["discordInfo"].iconURL);
            this.$store.state.loading = false;
        })
    }
}
</script>