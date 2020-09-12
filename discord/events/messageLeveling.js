const Discord = require("discord.js")
const { guildLevelingOf } = require("../../utils/dbUtils")

const cooldown = new Map()

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param  {import("discord.js").Message} message 
     */
    async run(client, message) {
        if(message.author.bot) return

        if(cooldown.has(message.author.id)) {
            if(cooldown.get(message.author.id) <= Date.now()) {
                cooldown.delete(message.author.id)
            } else {
                return;
            }
        }

        cooldown.set(message.author.id, Date.now())

        const xpToAdd = Math.floor(Math.random() * 10) + 10;

        console.log(`Adding ${xpToAdd} to ${message.author.tag}`);
        
        const leveling = guildLevelingOf(message.guild, message.author)
        await leveling.addXp(xpToAdd)
        const xpToNextLevel = ((await leveling.getLevel()) + 1) * 100;
        const xp = await leveling.getXp()
        if(xp >= xpToNextLevel) await leveling.levelUp()
    },
    config: {
        name: "Message Leveling",
        type: "message"
    }
}