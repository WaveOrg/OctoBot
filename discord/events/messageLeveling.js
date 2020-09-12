const Discord = require("discord.js")
const { guildLevelingOf } = require("../../utils/dbUtils")

const cooldown = new Map()

setInterval(() => {
    for(let [id, time] of cooldown.entries()) {
        if(time <= Date.now()) cooldown.delete(id)
    }
}, 60000)

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param  {import("discord.js").Message} message 
     */
    async run(client, message) {
        if(message.author.bot) return

        const id = `${message.author.id}-${message.guild.id}`

        if(cooldown.has(id)) {
            if(cooldown.get(id) <= Date.now()) {
                cooldown.delete(id)
            } else {
                return;
            }
        }

        cooldown.set(id, Date.now() + 60000)

        const xpToAdd = Math.floor(Math.random() * 10) + 10;
        
        const leveling = guildLevelingOf(message.guild, message.author)
        await leveling.addXp(xpToAdd)
        const currentLevel = await leveling.getLevel()
        const xpToNextLevel = (currentLevel + 1) * 100;
        const xp = await leveling.getXp()
        if(xp >= xpToNextLevel) {
            await leveling.levelUp()
            message.channel.send(`Yay, <@${message.member.id}> just leveled up to ${currentLevel + 1}`)
        }
    },
    config: {
        name: "Message Leveling",
        type: "message"
    }
}