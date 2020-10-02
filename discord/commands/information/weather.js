const Discord = require("discord.js")
const { logger } = require("../../../globals");
const utils = require("../../../utils/utils")
const weather = require('weather-js');

const { ErrorEmbed, InfoEmbed, RedEmbed } = require("../../../utils/utils");
module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {


        //check if there was a second arg
        if (!args[0]) return message.channel.send(ErrorEmbed("Enter a location to search for."));

        const loading = await message.channel.send(RedEmbed('<a:loading:752246174550982728> Getting Data', '').setFooter("Please wait..."))

        //search for the location and specify degree type
        weather.find({ search: args.join(" "), degreeType: "C" }, function (err, result) {
            if(err) loading.edit(ErrorEmbed("An error occured, please check if that location exists!"));

            const F = parseInt(result[0].current.temperature) * 9/5 + 32
            const FeelsLikeF = parseInt(result[0].current.feelslike) * 9/5 + 32

            let embed = InfoEmbed("Weather Data", '')
                .setThumbnail(result[0].current.imageUrl)
                .setDescription(`Showing weather data for ${result[0].location.name}`)
                .addField("**Temp:**", `${result[0].current.temperature}°C (${F}°F)`, true)
                .addField("**Weather:**", `${result[0].current.skytext}`, true)
                .addField("**Day:**", `${result[0].current.shortday}`, true)
                .addField("**Feels like:**", `${result[0].current.feelslike}°C`, true)
                .addField("**Humidity:**", `${result[0].current.humidity}%`, true)
                .addField("**Wind:**", `${result[0].current.winddisplay}`, true)

            loading.edit(embed);

        })
    

    },

    config: {
        command: "weather",
        aliases: ["temp", "climate"],
        description: "View your weather in your location",
        permissions: [],
        usage: `weather <location>`,
    }
}