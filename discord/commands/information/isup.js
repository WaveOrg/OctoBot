const Discord = require("discord.js")
const fetch = require("node-fetch")
const { ErrorEmbed, RedEmbed, InfoEmbed } = require("../../../utils/utils")

const isUpUrl = "https://api-prod.downfor.cloud/httpcheck/"

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        if(!args[0]) return message.channel.send(ErrorEmbed("You need to specify a website URL"))

        const url = args[0].toLowerCase()

        if(url.includes(":") || url.includes("@")) return message.channel.send(ErrorEmbed("The url must not include \`@\` or \`:\`"))

        const loading = await message.channel.send(RedEmbed('<a:loading:752246174550982728> Checking status', '').setFooter("This may take up to 20 seconds."))

        fetch(`${isUpUrl}${url}`).then(res => res.json()).then(res => {
            const embed = InfoEmbed(`Website is ${res.isDown ? "Down" : "Up"}`, "")
                            .setAuthor(`Status for ${url}`)
                            .addField("Status", `${res.statusCode} ${res.statusText.trim() !== "" ? "-" : ""} ${res.statusText.charAt(0).toUpperCase() + res.statusText.substring(1).toLowerCase()}`)
            
            if(res.requestedDomain !== res.returnedUrl) embed.addField("Redirect", `${res.requestedDomain} -> ${res.returnedUrl}`)

            loading.edit(embed)
        }).catch(err => {
            loading.edit(ErrorEmbed("Failed checking status").setFooter("This does not mean a website is down."))
        })
    },

    config: {
        command: "isup",
        aliases: ["websitestatus"],
        description: "Shows if a website is up",
        permissions: [],
        usage: `isup <website-url>`,
    }
}