const Discord = require("discord.js");
const Jimp = require("jimp");
const { guildLevelingOf, userDataOf } = require("../../../utils/dbUtils");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const fetch = require('node-fetch');
const { logger } = require("../../../globals");

var circleMask;
Jimp.read('./discord/assets/circle.png').then(img => circleMask = img.resize(256, 256))

var uniSansSmallBlue;
Jimp.loadFont('./discord/assets/Fonts/Uni Sans Heavy Blue.fnt').then(loaded => uniSansSmallBlue = loaded)

var uniSansLargeBlue;
Jimp.loadFont('./discord/assets/Fonts/Uni Sans Heavy Blue Large.fnt').then(loaded => uniSansLargeBlue = loaded)

var barBG;
Jimp.read('./discord/assets/barbg.png').then(loaded => barBG = loaded)

var barMask;
Jimp.read('./discord/assets/barMask.png').then(loaded => barMask = loaded)

var uniSansSmallGray;
Jimp.loadFont('./discord/assets/Fonts/Uni Sans Heavy Small.fnt').then(loaded => uniSansSmallGray = loaded)

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
        if(!member) return message.channel.send(ErrorEmbed(`This guild cannot be found in the database! If this error continues, contact support! \`${name}\``))

        const levelingData = guildLevelingOf(message.guild, message.author);
        
        const currentLevel = await levelingData.getLevel()
        const xpRequired = (currentLevel + 1) * 100;
        const currentXP = await levelingData.getXp()


        // looks ugly so no 

        // const tempMessage = await message.channel.send(InfoEmbed("", "")
        //                                     .setAuthor(member.user.tag, member.user.avatarURL)
        //                                     .addField("Level:", currentLevel, true)
        //                                     .addField("Xp:", currentXP, true)
        //                                     .addField("Required:", xpRequired, true))

        // Debugging stuff/
        const startDB = Date.now()

        const userData = userDataOf(member.user)

        var rankCardBase64 = await userData.getRankCard()

        const endDB = Date.now();
        logger.debug(`Took ${endDB - startDB}ms to get Database data.`)

        Jimp.read(rankCardBase64 === "null"? './discord/assets/rankCardDefault.png' : Buffer.from(rankCardBase64, "base64")).then(async rankCard => {
            const { width: cardWidth, height: cardHeight } = rankCard.bitmap;

            const startRead = Date.now()

            // User Avatar
            const avatarURL = member.user.avatarURL({ format: 'png', size: 256 }) 
                || "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png"

            const userAvatar = (await Jimp.read(avatarURL))
                .resize(256, 256)
                .mask(circleMask, 0, 0)
                .resize(cardHeight * 0.8, cardHeight * 0.8)

            const readImage = Date.now()

            const { width: userWidth, height: userHeight } = userAvatar.bitmap

            // Variables I use later
            const AvatarXY = (cardHeight - userHeight) / 2

            // Add bar
            // Start by getting width for blue bar.
            // Gray bar width is 491 px.
            // 0-100 needs to become 0-491
            const barWidth = scaleValue(currentXP, [0, xpRequired], [0, 491]);
            const bar = await Jimp.read('./discord/assets/bar.png')

            bar.cover(barWidth, bar.bitmap.height)
            bar.mask(barMask, 0, 0)

            // Text
            if(member.user.username.length > 11) {
                const parts = member.user.username.match(/.{1,21}/g)

                rankCard.print(uniSansSmallBlue, 
                    (AvatarXY * 2) + (cardWidth / 4), 
                    cardHeight / 8, parts[0])

                if(parts[1])  rankCard.print(uniSansSmallBlue, 
                    (AvatarXY * 2) + (cardWidth / 4), 
                    cardHeight / 3.75, parts[1])
            } else {
                rankCard.print(uniSansLargeBlue, 
                    (AvatarXY * 2) + (cardWidth / 4), 
                    cardHeight / 8, member.user.username)
            }

            rankCard.print(uniSansSmallBlue, 
                (AvatarXY * 2) + (cardWidth / 4), 
                cardHeight * 0.40, `Level ${currentLevel}`)

            rankCard.print(uniSansSmallGray, 
                (AvatarXY * 2) + (cardWidth / 4), 
                cardHeight * 0.57, `${currentXP}/${xpRequired} XP`)

            // Combine all layers
            rankCard.composite(barBG, (AvatarXY * 2) + (cardWidth / 4), cardHeight * 0.70)
            rankCard.composite(bar, (AvatarXY * 2) + (cardWidth / 4), cardHeight * 0.70)
            rankCard.composite(userAvatar, AvatarXY, AvatarXY)

            logger.debug(`Took ${readImage - startRead}ms to get profile picture from Discord.`)
            logger.debug(`Took ${startRead - endDB}ms to get background image.`)
            logger.debug(`Image Editing took ${Date.now() - readImage}ms.`)
            logger.debug(`Rank command took ${Date.now() - startDB}ms total.`)
            //await tempMessage.delete()
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

function scaleValue(value, from, to) {
	var scale = (to[1] - to[0]) / (from[1] - from[0]);
	var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
	return ~~(capped * scale + to[0]);
}