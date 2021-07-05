### DISCLAIMER: The bot is not 100% finished and has bugs, the project is officially abandoned but you're free to make PRs


# OctoBot | A multipurpose bot

This is the main part of the project, the bot.  
Developed by [Derock](https://github.com/ItzDerock) and [Antony](https://github.com/Antony1060) + contributors

### Requiremnets
- A Discord bot application, duh
- A MongoDB database
- StatCord Account
- At least 1 Lavalink host
- A [Genius](https://genius.com/developers) Api Key

### Running

1. Pull the code
2. Configure the bot
3. `npm install`
4. `node .`

### Configuration

1. Edit the `config.json` file

    |Key|Description|
    |---|---|
    |prefix| The default bot's prefix |
    |token| The bot token |
    |mongo.srvMode| To use `mognodb+srv` when connecting to the database or not |
    |mongo.user| The username for the database |
    |mongo.password| The password for the database |
    |mongo.host| Database host |
    |mongo.port| Database port |
    |mongo.databse| The name of the database|
    |statcordKey| The StatCord API Key |
    |lavalinkNodes| An Array containing all Lavalink nodes |
    |lavalinkNode.id| The ID of the Lavalink node |
    |lavalinkNode.host| Node host |
    |lavalinkNode.port| Node port |
    |lavalinkNode.password| Node password |
    |backend.port| The port you wish the backend to use, the backend is a websocket server |
    |backend.useHttps| Wether to use HTTPS while creating the backend server, requires ssl certificate and ssl key|
    |backend.ssl.certificate| The SSL certificate file location, relative to `./backend` |
    |backend.ssl.privateKey| The SSL private key file location, relative to `./backend` |
    |apis.genius.apiKey| The Genius API Key |


2. Rename `.env.example` to `.env`
3. Change JWT_SECRET to something secure, must match JWT_SECRET in the [authentication service](https://github.com/Octo-Development-Team/PanelAuthentication)
