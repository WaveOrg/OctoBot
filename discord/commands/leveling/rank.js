const Discord = require("discord.js");
const Jimp = require("jimp");
const { guildLevelingOf, userDataOf } = require("../../../utils/dbUtils");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const fetch = require('node-fetch');
const { logger } = require("../../../globals");

var circleMask;
Jimp.read('./discord/assets/circle.png').then(img => circleMask = img)

var uniSansSmallBlue;
Jimp.loadFont('./discord/assets/Fonts/Uni Sans Heavy Blue.fnt').then(loaded => uniSansSmallBlue = loaded)

var uniSansLargeBlue;
Jimp.loadFont('./discord/assets/Fonts/Uni Sans Heavy Blue Large.fnt').then(loaded => uniSansLargeBlue = loaded)

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        /** @type {Discord.GuildMember} */
        let member;
        if(!args[0]) member = message.member;

        let name = args.join(" ").toLowerCase()

        if(!member) member = message.mentions.members.first()
        if(!member) member = message.guild.members.cache.find(m => m.id === args[0])
        if(!member) member = message.guild.members.cache.find(m => m.user.tag.toLowerCase() === name);
        if(!member) member = message.guild.members.cache.find(m => m.displayName.toLowerCase() === name);
        if(!member) member = message.guild.members.cache.find(m => m.displayName.toLowerCase().startsWith(name))
        if(!member) return message.channel.send(ErrorEmbed(`I can't find a guild member that goes by \`${name}\``))

        const levelingData = guildLevelingOf(message.guild, message.author);
        
        const currentLevel = await levelingData.getLevel()
        const xpRequired = (currentLevel + 1) * 100;

        const tempMessage = await message.channel.send(InfoEmbed("", "")
                                            .setAuthor(member.user.tag, member.user.avatarURL)
                                            .addField("Level:", currentLevel, true)
                                            .addField("Xp:", (await levelingData.getXp()), true)
                                            .addField("Required:", xpRequired, true))

        // Debugging stuff/
        const startDB = Date.now()

        const userData = userDataOf(member.user)

        var rankCardBase64 = await userData.getRankCard()

        const endDB = Date.now();
        logger.debug(`Took ${endDB - startDB}ms to get Database data.`)

        console.log(rankCardBase64 === "null"? './discord/assets/rankCardDefault.png' : Buffer.from(rankCardBase64, "base64"))
        Jimp.read(rankCardBase64 === "null"? './discord/assets/rankCardDefault.png' : Buffer.from(rankCardBase64, "base64")).then(async rankCard => {
            const { width: cardWidth, height: cardHeight } = rankCard.bitmap;

            const startRead = Date.now()

            // User Avatar
            const avatarURL = member.user.avatarURL({ format: 'png', size: 512 }) 
                || "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png"

            const userAvatar = (await Jimp.read(avatarURL))
                .resize(512, 512)
                .mask(circleMask, 0, 0)
                .resize(cardHeight * 0.8, cardHeight * 0.8)

            const readImage = Date.now()

            const { width: userWidth, height: userHeight } = userAvatar.bitmap

            // Variables I use later
            const AvatarXY = (cardHeight - userHeight) / 2

            // Poor-man's shadow
            // No longer needed - shadow included in image to save procesing power
            // const shadow = new Jimp(userWidth + 80, userHeight + 80, '#000000')
            
            // shadow.circle({
            //     radius: userWidth / 2,
            //     x: userHeight / 2 + 40,
            //     y: userHeight / 2 + 40
            // })

            // shadow.blur(20)

            // Text
            rankCard.print(uniSansLargeBlue, 
                (AvatarXY * 2) + (cardWidth / 4), 
                cardHeight / 8, member.user.tag)

            rankCard.print(uniSansSmallBlue, 
                (AvatarXY * 2) + (cardWidth / 4), 
                cardHeight * 0.40, `Level ${await levelingData.getLevel()}`)

            // Combine all layers
            //rankCard.composite(shadow, AvatarXY - 40, AvatarXY - 40)
            rankCard.composite(userAvatar, AvatarXY, AvatarXY)

            logger.debug(`Took ${readImage - startRead}ms to get profile picture from Discord.`)
            logger.debug(`Image Editing took ${Date.now() - readImage}ms.`)
            logger.debug(`Rank command took ${Date.now() - startDB}ms total.`)
            await tempMessage.delete()
            message.channel.send(new Discord.MessageAttachment(await rankCard.getBufferAsync(Jimp.MIME_PNG)))
        })
    },

    config: {
        command: "rank",
        aliases: ["level"],
        description: "View your rank",
        permissions: [],
        usage: `rank [mention/name/id]`,
    }
}