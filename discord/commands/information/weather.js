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
        let degree;
        //check if the user entered a first arg
        if (args[0]) {
            //check if the first argument was a valid degree type
            if (args[0] === "C" || args[0] === "c" || args[0] === "F" || args[0] === "f") {
                degree = args[0].toUpperCase();
            } else {
                return message.channel.send(ErrorEmbed("Enter a valid degree type (C | F)."));
            }
        } else {
            return message.channel.send(ErrorEmbed("Enter a degree type (C | F)."));
        }

        //check if there was a second arg
        if (!args[1]) return message.channel.send(ErrorEmbed("Enter a location to search for."));

        const loading = await message.channel.send(RedEmbed('<a:loading:752246174550982728> Taking a picture', '').setFooter("This may take up to 60 seconds."))

        //search for the location and specify degree type
        weather.find({ search: args[1], degreeType: degree }, function (err, result) {
            try {
                //TODO: add a 5 day forecast

                //create a new embed with the weather data
                let embed = new Discord.MessageEmbed()
                    .setColor("008000")
                    .setTitle(`Weather`)
                    .setThumbnail(result[0].current.imageUrl)
                    .setDescription(`Showing weather data for ${result[0].location.name}`)
                    .addField("**Temp:**", `${result[0].current.temperature}°${result[0].location.degreetype}`, true)
                    .addField("**Weather:**", `${result[0].current.skytext}`, true)
                    .addField("**Day:**", `${result[0].current.shortday}`, true)
                    .addField("**Feels like:**", `${result[0].current.feelslike}°${result[0].location.degreetype}`, true)
                    .addField("**Humidity:**", `${result[0].current.humidity}%`, true)
                    .addField("**Wind:**", `${result[0].current.winddisplay}`, true)
                loading.edit(embed);
            } catch (err) {
                console.log(err); //log an error to the console if one occurs

                return message.channel.send(ErrorEmbed("Are you sure that place exists?")); //return message to channel
            }
        })
    

    },

    config: {
        command: "weather",
        aliases: ["w"],
        description: "View your weather in your location",
        permissions: [],
        usage: `weather [C/F] [Location]`,
    }
}