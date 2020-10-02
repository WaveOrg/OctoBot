var backend = null;

var socket = {
    connect: function() {
        backend = io("http://127.0.0.1:8080", {
            path: "/ws"
        })
        
        backend.on("connect", () => console.log("WebSocket Connected"))
    },

    request: function(path, payload) {
        return new Promise((resolve, _) => {
            const handler = (response) =>{
                if(response._path !== path || JSON.stringify(response._payload) !== JSON.stringify(payload)) return;
                backend.removeListener(path, handler);

                delete response["_path"];
                delete response["_payload"];

                resolve(response)
            }

            backend.on(path, handler)
            backend.emit(path, payload);
        }) 
    }
}