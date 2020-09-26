const os = require("os");
const sysInfo = require("systeminformation");
const { InfoEmbed } = require("../../../utils/utils");

let latestSysInfo = null;

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {

        if(!latestSysInfo) return;

        const node = process.version;
        const shard = client.shard ? client.shard.count : 1;
        const platform = `${os.platform()[0].toUpperCase() + os.platform().slice(1)
            } ${os.arch()} ${os.release()}`;
        const core = os.cpus().length;
        const cpu = os.cpus()[0].model;
        const coreSpeed = os.cpus().reduce((acc, val) => acc + val.speed, 0) / core;

        const embed = InfoEmbed("", "")
            .setTitle(`${client.user.username} System Stats`)
            .setColor('DARK_BLUE')
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .addField("Node", `\`\`\`${node}\`\`\``, true)
            .addField("Platform", `\`\`\`${platform}\`\`\``, true)
            .addField("Cores", `\`\`\`${latestSysInfo.cpu.cores} Cores\`\`\``, true)
            .addField("CPU", `\`\`\`${cpu}\`\`\``)
            .addField("Average Core Speed", `\`\`\`${coreSpeed} MHz\`\`\``, true)
            .addField("Current CPU Load", `\`\`\`${latestSysInfo.cpu.load}%\`\`\``, true)
            .addField("Memory Usage", `\`\`\`${readableBytes(latestSysInfo.memory.used)}/${readableBytes(latestSysInfo.memory.total)} (${latestSysInfo.memory.usage}%)\`\`\``, true)
            .addField("Disk Usage", `\`\`\`${readableBytes(latestSysInfo.disk.used)}/${readableBytes(latestSysInfo.disk.total)} (${latestSysInfo.disk.usage}%)\`\`\``, true)
            .addField("Network Traffic", `\`\`\`Down: ${readableBytes(latestSysInfo.network.down)} | Up: ${readableBytes(latestSysInfo.network.up)}\`\`\``, true)
            .addField("Shards", `\`\`\`${shard} Shards\`\`\``, true)
            .setTimestamp();


        message.channel.send(embed).catch();
    },
    config: {
        command: "sys",
        aliases: ["system"],
        description: "Check System Stats",
        usage: `sys`,
        admin: true
    }
}



setInterval(async () => {
    // CPU Usage
    const cpuData = await sysInfo.currentLoad()

    // RAM Usage
    const memData = await sysInfo.mem()

    // Disk Usage
    const fsData = await sysInfo.fsSize();

    // Network usage
    const netInfo = await sysInfo.networkStats()

    latestSysInfo = {
        cpu: {
            load: cpuData.currentload.toFixed(2),
            cores: cpuData.cpus.length
        },
        memory: {
            used: memData.active,
            total: memData.total,
            usage: ((memData.active/memData.total) * 100).toFixed(2)
        },
        disk: {
            used: fsData[0].used,
            total: fsData[0].size,
            usage: fsData[0].use
        },
        network: {
            down: netInfo[0].tx_sec,
            up: netInfo[0].rx_sec
        }
    }
}, 1000)

function readableBytes(bytes) {
    const i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
}