const { logger } = require('../../globals');
const { guildOptionsOf } = require('../../utils/dbUtils');
const { modules, welcomeLeaveTypes } = require("../../database/constants");

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param  {import("discord.js").GuildMember} member
     */
    async run(client, member) {
        const guildOptions = guildOptionsOf(member.guild)

        if(!await guildOptions.isModuleEnabled(modules.WELCOME_MESSAGES)) return;

        const res = await guildOptions.getWelcomeMessage();
        const chnlid = res.getChannelId();
        const msg = res.getData();
        const type = res.getDataType();

        if(!chnlid || !msg || !type) return;
        
        const channel = member.guild.channels.resolve(chnlid);

        if(!channel) return;

        if(type == welcomeLeaveTypes.TEXT) channel.send(msg
            .replace(/%member%/g, member.user.username)
            .replace(/%tag%/g, member.user.tag)
            .replace(/%mention%/g, `<@${member.id}>`)
            .replace(/%server%/g, member.guild.name))
        .catch(err => { logger.error(err) })

    },
    config: {
        name: "Welcome Messages",
        type: "guildMemberAdd"
    }
}
