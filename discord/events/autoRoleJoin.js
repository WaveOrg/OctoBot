const { logger } = require("../../globals");
const { guildOptionsOf } = require('../../utils/dbUtils');
const { modules } = require("../../database/constants");

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param  {import("discord.js").GuildMember} member
     */
    async run(client, member) {
        const guildOptions = guildOptionsOf(member.guild)

        if(!await guildOptions.isModuleEnabled(modules.AUTO_ROLE)) return;

        if(!(await guildOptions.isAutoRoleEnabled())) return;

        const role = await member.guild.roles.fetch(await guildOptions.getAutoRoleId());
        if(!role) return;
        member.roles.add(role).catch(err => {
            logger.error(`Error when processing auto role for ${member.guild.id}: ${err}`)
        });
    },
    config: {
        name: "Auto Role",
        type: "guildMemberAdd"
    }
}
