const Discord = require("discord.js")
const { utils, logger } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } =  require("../../../utils/utils");;

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {

        message.channel.send(

            InfoEmbed(message.mentions.members.first()? `Happy Birthday ${message.mentions.members.first().user.tag}!` : "Happy Birthday!", 
`
\`\`\`
                   \)\\
                  (__)
                   \/\\
                  [[]]
               @@@[[]]@@@
         @@@@@@@@@[[]]@@@@@@@@@
     @@@@@@@      [[]]      @@@@@@@
 @@@@@@@@@        [[]]        @@@@@@@@@
@@@@@@@           [[]]           @@@@@@@
!@@@@@@@@@                    @@@@@@@@@!
!    @@@@@@@                @@@@@@@    !
!        @@@@@@@@@@@@@@@@@@@@@@        !
!              @@@@@@@@@@@             !
!             ______________           !
!             HAPPY BIRTHDAY           !
!             --------------           !
!!!!!!!                          !!!!!!!
     !!!!!!!                !!!!!!!
         !!!!!!!!!!!!!!!!!!!!!!!
\`\`\`
`)  );
    },

    config: {
        command: "birthday",
        aliases: ['bday'],
        description: "Happy Birthday!",
        permissions: [],
        usage: `birthday [@user]`
    }
}