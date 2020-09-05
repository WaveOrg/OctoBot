const Discord = require("discord.js");
const { utils, logger } = require("../../../globals");
const { questions: leaugeTrivia } = require('../../data/trivia/leauge.json');
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const fetch = require('node-fetch');

const categories = {
    "Any": 'no',
    "League of Legends": 'file',
    "General": 9,
    "Books": 10,
    "Film": 11,
    "Music": 12,
    "Musicals & Theaters": 13,
    "Television": 14,
    "Video Games": 15,
    "Board Games": 16,
    "Science & Nature": 17,
    "Computers": 18,
    "Mathematics": 19,
    "Mythology": 20,
    "Sports": 21,
    "Geography": 22,
    "History": 23,
    "Politics": 24,
    "Art": 25,
    "Celebrities": 26,
    "Animals": 27
}

const runningTrivia = new Map();

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {

        if(runningTrivia.has(message.channel.id)) {
            if(args[0] && args[0].toLowerCase() == "stop") {
                let currentScores = runningTrivia.get(message.channel.id)
                runningTrivia.delete(message.channel.id);

                const sorted = sortProperties(currentScores);
                message.channel.send(InfoEmbed("🎉 Trivia Winners!", `${sorted.map(v => `<@${v[0]}> - **${v[1]}**`).join("\n")}`))

                return;
            } else return message.channel.send(ErrorEmbed("The ocean police told us we can only let people have one trivia per channel!"))
        }

        var amount = isNaN(args[0])? 10 : parseInt(args[0]);
        var subject = isNaN(amount)? args.join(" ") : args[1]? args.slice(1).join(" ") : null;

        if(!subject) {
            await message.channel.send(
                InfoEmbed("❓ Trivia!", "Reply with a category, or type `ALL` for all categories!\nValid Categories: " + Object.keys(categories).map(k => `\`${k}\` `).join(" ") + "\n**TIP: You can use `trivia [amount of questions] [category]` to quickly start a trivia**")
                .setFooter("Bad responses will be ignored!")
            )

            subject = (await message.channel.awaitMessages(m => m.author.id == message.author.id && categories[m.content], {max: 1})).first().content

            await message.channel.send(
                InfoEmbed("❓ Trivia!", "How many questions do you want?\n \n**TIP: You can use `trivia [amount of questions] [category]` to quickly start a trivia**")
                .setFooter("Response should be a valid number!")
            )

            amount = parseInt((await message.channel.awaitMessages(m => m.author.id == message.author.id && !isNaN(m.content), {max: 1})).first().content)
        } else {
            if(!categories[subject]) return message.channel.send(
                InfoEmbed("❓ Unknown Category.", "Valid Categories: " + Object.keys(categories).map(k => `\`${k}\` `).join(" ") + "\nYou can use `ALL` for any category.")
            )
        }

        if(amount > 20) return message.channel.send(
            ErrorEmbed("Maximum of 20 questions!")
        )

        var questions = [];

        if(subject == "League of Legends") {
            for(let i = 0; i < amount; i++ ) {
                questions.push(leaugeTrivia[Math.floor(Math.random() * leaugeTrivia.length)])

                // question: str, answers: [str]
            }
        } else {
            const { response_code: code, results: results } = await (await fetch(`https://opentdb.com/api.php?amount=${amount}${categories[subject] == 'no'? `` : `&category=${categories[subject]}`}`)).json()
     
            if(code != 0) {
                logger.error(`Got ${code} on https://opentdb.com/api.php?amount=${amount}${categories[subject] == 'no'? `` : `&category=${categories[subject]}`}`)
                return message.channel.send(ErrorEmbed("There was an error processing your request. Please try again later. Error code: " + code))
            }

            questions = results

            // question: str, correct_answer: str
        }

        runningTrivia.set(message.channel.id, {})
        trivia(questions, message.channel)
    },
    config: {
        command: "trivia",
        aliases: ["quiz"],
        description: " Quiz yourself on different topics!",
        usage: `trivia [amount of questions] [category] |or| stop`
    }
}

/**
 * 
 * @param {string} q 
 * @param {string | array} a 
 * @param {Discord.TextChannel} channel 
 */
async function ask(q, i, a, channel) {

    q = unescape(q);

    if(i.length > 0) {
        let incAndCorr = shuffle(i)
        await channel.send(InfoEmbed(q, incAndCorr.map(f => `\`${f}\``).join(" ")).setFooter("8 seconds to respond!"));
    } else {
        await channel.send(InfoEmbed(q, "You have eight seconds to respond."));
    }

    const f = await channel.awaitMessages(m => !m.bot && typeof a == "string"? m.content.toLowerCase() == a.toLowerCase() : a.includes(m.content.toLowerCase()), { time: 8000 })
    
    if(runningTrivia.has(channel.id)) channel.send(InfoEmbed("🎉 The following people got the answer correct!", f.map(message => `<@${message.author.id}>`).join(" ") || "No one!"))

    return f.map(message => message.member.id )
}

/**
 * 
 * @param {array} questions 
 * @param {Discord.TextChannel} channel 
 */
async function trivia(questions, channel, scores = {}) {

    if(!runningTrivia.has(channel.id)) return;

    const question = questions.shift()
    runningTrivia.set(channel.id, scores)

    if(question) {
        const points = await ask(question.question, question.incorrect_answers || [], question.correct_answer || question.answers.map(e => e.toLowerCase()), channel);

        points.forEach(user => {
            if(scores[user]) scores[user]++;
            else scores[user] = 1;
        })

        trivia(questions, channel, scores);
    } else {
        const sorted = sortProperties(scores);

        channel.send(InfoEmbed("🎉 Trivia Winners!", `${sorted.map(v => `<@${v[0]}> - **${v[1]}**`).join("\n")}`))
    }
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Sort object properties (only own properties will be sorted).
 * @param {object} obj object to sort properties
 * @param {bool} isNumericSort true - sort object properties as numeric value, false - sort as string value.
 * @returns {Array} array of items in [[key,value],[key,value],...] format.
 */
function sortProperties(obj, isNumericSort)
{
	isNumericSort=isNumericSort || false; // by default text sort
	var sortable=[];
	for(var key in obj)
		if(obj.hasOwnProperty(key))
			sortable.push([key, obj[key]]);
	if(isNumericSort)
		sortable.sort(function(a, b)
		{
			return a[1]-b[1];
		});
	else
		sortable.sort(function(a, b)
		{
			var x=a[1].toLowerCase(),
				y=b[1].toLowerCase();
			return x<y ? -1 : x>y ? 1 : 0;
		});
	return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}