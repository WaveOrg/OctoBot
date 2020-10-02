const { TextChannel } = require('discord.js');

/**
 * Create a menu with customisable reactions for every page.
 * Blacklisted page names are: `first, last, previous, next, stop`.
 * Each name, when set to a reaction value, will do as you expect it to.
 * Stop deletes the menu message.
 * @param channel The text channel you want to send the menu in.
 * @param userID The ID of the user you want to let control the menu.
 * @param pages An array of page objects with a name, content MessageEmbed and a set of reactions with page names which lead to said pages.
 */

module.exports.Menu = class {
    /**
     * 
     * @param {TextChannel} channel 
     * @param {string} userID 
     * @param {Array} pages 
     */
    constructor(channel, userID, pages) {
        this.channel = channel;
        this.lastPage = null;
        this.userID = userID;
        this.pages = pages;
        this.currentPage = pages[0];
        this.page = 0;

        channel.send(this.currentPage.content).then(menu => {
            this.menu = menu;
            this.react();
            this.awaitReactions();
        });
    }

    setPage(page, userID, reaction) {
        this.page = page;
        this.lastPage = this.currentPage;
        this.currentPage = this.pages[page];

        this.menu.edit(this.currentPage.content);

        if(this.lastPage && JSON.stringify(this.lastPage.reactions) != JSON.stringify(this.currentPage.reactions)) {
            this.menu.reactions.removeAll();
            this.reactionCollector.stop();
            this.react();
            this.awaitReactions();
        } else {
            this.menu.reactions.resolve(reaction).users.remove(userID)
            this.reactionCollector.stop();
            this.awaitReactions();
        }
    }
    react() {
        for(const reaction in this.currentPage.reactions) {
            this.menu.react(reaction);
        }
    }
    awaitReactions() {
        this.reactionCollector = this.menu.createReactionCollector((reaction, user) => user.id == this.userID && !user.bot, {time: 180000});
        this.reactionCollector.on('collect', (reaction, user) => {
            if (this.currentPage.reactions.hasOwnProperty(reaction.emoji.id)) {

                let destination = this.currentPage.reactions[reaction.emoji.id];
                switch (destination) {
                    case "first":
                        this.setPage(0, user.id, reaction);
                        break;
                    case "last":
                        this.setPage(this.pages.length - 1, user.id, reaction);
                        break;
                    case "previous":
                        if (this.page > 0) {
                            this.setPage(this.page - 1, user.id, reaction);
                        }
                        break;
                    case "next":
                        if (this.page < this.pages.length - 1) {
                            this.setPage(this.page + 1, user.id, reaction);
                        }
                        break;
                    case "stop":
                        this.reactionCollector.stop();
                        this.menu.delete();
                        break;
                    default:
                        this.setPage(this.pages.findIndex(p => p.name == destination), user.id, reaction);
                        break;
                }
            }
        });
    }
}