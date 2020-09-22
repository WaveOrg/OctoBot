const os = require("os");
const { InfoEmbed } = require("../../../utils/utils");

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {

        const node = process.version;
        const shard = this.bot.shard ? this.bot.shard.count : 1;
        const platform = `${os.platform()[1].toUpperCase() + os.platform().slice(1)
            } ${os.arch()}`;
        const core = os.cpus().length;
        const cpu = os.cpus()[0].model;
        const coreSpeed = os.cpus().reduce((acc, val) => acc + val.speed, 0) / core;
        const memory = Math.ceil((os.totalmem() - os.freemem()) / 1e6);

        const embed = InfoEmbed("", "")
            .setTitle(`${this.bot.user.username} System Stats`)
            .setColor('DARK_BLUE')
            .setFooter(this.bot.user.username, this.bot.user.displayAvatarURL())
            .setTimestamp()
            .addField("Node", `\`\`\`${node}\`\`\``, true)
            .addField("Platform", `\`\`\`${platform}\`\`\``, true)
            .addField("Cores", `\`\`\`${core} Cores\`\`\``, true)
            .addField("CPU", `\`\`\`${cpu}\`\`\``)
            .addField("Average Core Speed", `\`\`\`${coreSpeed} MHz\`\`\``, true)
            .addField("Memory In Use", `\`\`\`${memory} MB\`\`\``, true)
            .addField("Shards", `\`\`\`${shard} Shards\`\`\``, true);


        message.channel.send(embed).catch();
    },
    config: {
        command: "sys",
        aliases: ["system"],
        description: "Check System Stats",
        usage: `sys`
    }
}