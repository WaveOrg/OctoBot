const { logger } = require('../../globals');
const { guildOptionsOf } = require('../../utils/dbUtils');

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param  {import("discord.js").GuildMember} member
     */
    async run(client, member) {
        const guildOptions = guildOptionsOf(member.guild)

        if(!await guildOptions.isModuleEnabled("WELCOME_MESSAGES")) return;

        // TODO: SEND
    },
    config: {
        name: "Welcome Messages",
        type: "guildMemberAdd"
    }
}
