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

## Some notes
Here I will refer to *`me`* as *`Antony#9971`* on Discord

- If a value is `Nullable`, you should perform a null check when getting it's value.
- If a return type is any type of a promise, you *should* use `await` when envoking it.
- If something doesn't work, make sure to dm ***me*** about it
- If you're working on something and believe it should be stored in a database, dm me and I'll add it to the database in the lowest time possible.
- If you're confused about anything, make sure to also dm me.

## Container methods and functions
- ### All - this is gonna container methods common to all containers
    - #### `getFromDatabase()`
        - Description: *Returns a whole response document from the database*
        - Returns: *Promise<Mongoose.Document>*
    - #### `getProperty(property: String)`
        - Description: *Returns a specific property from the database*
        - Returns: *Promise\<any>*
    - #### `setProperty(property: String, newValue: any)`
        - Description: *Sets a specific `property` to the `newValue`*
        - Returns: *Promise*
        - Note: *`property` supports dot notation*
    - #### `setPropertyWithObject(update: Object)`
        - Description: *Updates something in the database*
        - Returns: *Promise*
    - #### `resetEverything()`
        - Description: *Resets the object in the database corresponding to the container type to default values*
        - Returns: *Promise*
        - Note: ***You really shouldn't use this if you don't know exactly what you're doing***
- ### GuildOptionsContainer
    - #### `getPrefix()`
        - Description: *Returns the guild prefix*
        - Returns: *Promise\<String>*
    - #### `setPrefix(prefix)`
        - Description: *Sets the guild prefix*
        - Returns: *Promise*
    - #### `getActiveModules()`
        - Description: *Returns all the active modules a guild has*
        - Returns: *Promise<Array\<String>>*
    - #### `setActiveModules(activeModules: Array<String>)`
        - Description: *Sets the guild active modules*
        - Note: *Use modules object from `/database/constants.js` for elements of the `activeModules` array. You can autocomplete and it's easy.*
        - ***Deprecated** Use other module methods instead*
    - #### `isModuleEnabled(module: String)`
        - Description: *Checks if a supplied module is enabled in a guild*
        - Returns: *Promise\<Boolean>*
        - Note: *Use modules object from `/database/constants.js` as the `module`. You can autocomplete and it's easy.*
    - #### `enableModule(module: String)`
        - Description: *Enables a supplied module*
        - Returns: *Promise*
        - Note: *Use modules object from `/database/constants.js` as the `module`. You can autocomplete and it's easy.*
    - #### `disableModule(module: String)`
        - Description: *Disable a supplied module*
        - Returns: *Promise*
        - Note: *Use modules object from `/database/constants.js` as the `module`. You can autocomplete and it's easy.*
    - #### `toggleModule(module: String)`
        - Description: *Toggles a supplied module*
        - Returns: *Promise*
        - Note: *Use modules object from `/database/constants.js` as the `module`. You can autocomplete and it's easy.*
    - #### `getWelcomeMessage()`
        - Description: *Returns an instance of a `WelcomeLeaveMessageContainer` // More on this later*
        - Returns: *Promise\<WelcomeLeaveMessageContainer>*
    - #### `getLeaveMessage()`
        - Description: *Returns an instance of a `WelcomeLeaveMessageContainer` // More on this later*
        - Returns: *Promise\<WelcomeLeaveMessageContainer>*
    
        ### WelcomeLeaveMessageContainer
        - #### `getChannelId()`
            - Description: *Returns the channel id where messages should be sent*
            - Returns: *String*
            - Nullable: `Yes`
        - #### `setChannelId(channelId: String)`
            - Description: *Set the channel id*
            - Returns: *Promise*
        - #### `getDataType()`
            - Description: *Returns the data type of the welcome/leave message*
            - Returns: *String*
            - Note: *Values should correspond with `welcomeLeaveTypes` in `database/constatnts.js`.*
        - #### `setDataType(dataType: String)`
            - Description: *Sets the data type*
            - Returns: *Promise*
            - Note: *Values should correspond with `welcomeLeaveTypes` in `database/constatnts.js` and should be used from there.*
        - #### `getData()`
            - Description: *Returns the data of the welcome/leave message*
            - Returns: *String*
            - Note: *This should correspond to the data type.*
        - #### `setData(data: String)`
            - Description: *Sets the data*
            - Returns: *Promise*
            - Note: *This should correspond to the data type.*
- ### UserDataContainer
    - #### `isPremium()`
        - Description: *Get the premium status of a user*
        - Returns: *Promise\<Boolean>*
    - #### `setPremium(premiumState: Boolean)`
        - Description: *Set the premium state of a user*
        - Returns: *Promise*
        - ***Deprecated** Use other methods instead*
    - #### `enablePremium()`
        - Description: *Enables user's premium*
        - Returns: *Promise*
    - #### `disablePremium()`
        - Description: *Disable user's premium*
        - Returns: *Promise*
    - #### `togglePremium()`
        - Description: *Toggles user's premium state*
        - Returns: *Promise*
    - #### `getRankCard()`
        - Description: *Returns a rank card image in Base64*
        - Returns: *Promise\<String>*
        - Nullable `Yes`
    - #### `setRankCard(imageBase64: String)`
        - Description: *Set a rank card image in Base64*
        - Returns: *Promise*
- ### GuildLevelingContainer
    - #### `getXp()`
        - Description: *Returns the amount of xp a member has*
        - Returns: *Promise\<Number>*
    - #### `setXp(xp: Number)`
        - Description: *Set's the amount of member's xp*
        - Returns: *Promise*
    - #### `addXp(xp: Number)`
        - Description: *Adds to a current amount of member's xp*
        - Returns: *Promise*
    - #### `getLevel()`
        - Description: *Returns the level of a member*
        - Returns: *Promise\<Number>*
    - #### `setLevel(level: Number)`
        - Description: *Set's the member's level*
        - Returns: *Promise*
    - #### `levelUp()`
        - Description: *Does everything necessary for a member to level up*
        - Returns: *Promise*