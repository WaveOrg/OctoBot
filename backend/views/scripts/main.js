socket.connect()

async function doSomething() {
    console.log(await socket.request("/gqlGuild", { query: `
    {
      guilds {
        id
        prefix
      }
    }
    ` }))
}