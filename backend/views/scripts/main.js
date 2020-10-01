socket.connect()

async function doSomething() {
    console.log(await socket.request("/testRoute", { hi: "asdjhasjdashdjashd" }))
}