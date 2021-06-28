module.exports = {
    modules: {
        MUSIC: "music",
        MODERATION: "moderation",
        WELCOME_MESSAGES: "welcomeMessage",
        LEAVE_MESSAGES: "leaveMessage",
        USER_VERIFICATION: "userVerification",
        AUTO_RESPONDER: "autoRespond",
        AUTO_ROLE: "autoRole",
        TICKETS: "tickets",
        FUN: "fun",
        PERSISTENT_ROLES: "persistentRoles",
        CUSTOM_COMMANDS: "customCommands"
    },
    welcomeLeaveTypes: {
        TEXT: "text", // Normal text
        JSON_EMBED: "embed", // Embed, stored as json string, not implemented
        IMAGE_BASE64: "image" // Image encoded in base64, not implemented
    },

    unimplementedModules: [
        "moderation",
        "userVerification",
        "autoRespond",
        "autoRole",
        "tickets",
        "persistentRoles",
        "customCommands"
    ]
}