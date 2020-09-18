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
- ### All - this is gonna container methods common to all containers
    - ### `getFromDatabase()`
        - Description: *Returns a whole response document from the database*
        - Returns: *Promise<Mongoose.Document>*
    - ### `getProperty(property: String)`
        - Description: *Returns a specific property from the database*
        - Returns: *Promise\<any>*
    - ### `setProperty(property: String, newValue: any)`
        - Description: *Sets a specific `property` to the `newValue`*
        - Returns: *Promise*
        - Note: *`property` supports dot notation*
    - ### `setPropertyWithObject(update: Object)`
        - Description: *Updates something in the database*
        - Returns: *Promise*
- ### GuildOptionsContainer
    - ### `getPrefix()`
        - Description: *Returns the guild prefix*
        - Returns: *Promise\<String>*
    - ### `setPrefix(prefix)`
        - Description: *Sets the guild prefix*
        - Returns: *Promise*
    - ### `getActiveModules()`
        - Description: *Returns all the active modules a guild has*
        - Returns: *Promise<Array\<String>>*
    - ### `setActiveModules(activeModules: Array<String>)`
        - Description: *Sets the guild active modules*
        - Note: *Use modules object from `/database/constants.js` for elements of the `activeModules` array. You can autocomplete and it's easy.*
        - ***Deprecated** Use other module methods instead*
    - ### `isModuleEnabled(module: String)`
        - Description: *Checks if a supplied module is enabled in a guild*
        - Returns: *Promise\<Boolean>*
        - Note: *Use modules object from `/database/constants.js` as the `module`. You can autocomplete and it's easy.*
    - ### `enableModule(module: String)`
        - Description: *Enables a supplied module*
        - Returns: *Promise*
        - Note: *Use modules object from `/database/constants.js` as the `module`. You can autocomplete and it's easy.*
    - ### `disableModule(module: String)`
        - Description: *Disable a supplied module*
        - Returns: *Promise*
        - Note: *Use modules object from `/database/constants.js` as the `module`. You can autocomplete and it's easy.*
    - ### `toggleModule(module: String)`
        - Description: *Toggles a supplied module*
        - Returns: *Promise*
        - Note: *Use modules object from `/database/constants.js` as the `module`. You can autocomplete and it's easy.*