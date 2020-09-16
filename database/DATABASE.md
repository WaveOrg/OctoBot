## Database containers
Database containers are classes used to *abstractify* raw requests to the database. We use this so people don't mess up what's already in the database and how the information is retrieved.
Types of containers:
- **GuildOptionsContainer**
    - *WelcomeLeaveMessageContainer*
- **UserDataContainer**
- **GuildLevelingContainer**
## Getting an instance of a Database container
1. ### Using Discord structures (without autocomplete, but a bit nicer imo)
    - ### GuildOptions
        ```js
        guild.getOptions()
        ```
    - ### UserData
        ```js
        user.getData()
        ```
    - ### GuildLeveling
        ```js
        user.getLevelingIn(guild)
        member.getLeveling()
        ```
        Examples
        ```js
        async run(message, args, client) {
            const guildOptions = message.guild.getOptions()
            const userData = message.author.getData()
            const leveling = message.member.getLeveling() || message.author.getLevelingIn(message.guild)

            // Examples of usage, more on this later
            const prefix = await guildOptions.getPrefix()
            const isPremium = await userData.isPremium()
            const level = await leveling.getLevel()
        }
        ```
2. ### Using functions from a seperate file (with autocomplete)
    - Importing a file
        ```js
        // Let's say we are currently working in the root directory
        const dbUtils = require("./utils/dbUtils.js")
        ```
    - ### GuildOptions
        ```js
        dbUtils.getOptionsOf(guild)
        ```
    - ### UserData
        ```js
        dbUtils.userDataOf(user)
        ```
    - ### GuildLeveling
        ```js
        dbUtils.guildLevelingOf(guild, user)
        ```
        Examples
        ```js
        const { getOptionsOf, userDataOf, guildLevelingOf } = require("../../../utils/dbUtils");
        
        async run(message, args, client) {
            const guildOptions = getOptionsOf(message.guild)
            const userData = userDataOf(message.author)
            const leveling = guildLevelingOf(message.guild, message.author)

            // Examples of usage, more on this later
            const prefix = await guildOptions.getPrefix()
            const isPremium = await userData.isPremium()
            const level = await leveling.getLevel()
        }
        ```
## Container methods and functions
- ### GuildOptions
    ```js
    
    ```
