import io from 'socket.io-client'

export default {
    connect: function(instance) {
        return new Promise(r => {
            if(!instance.$store.state.socket) {
                instance.$store.state.socket = io("http://127.0.0.1:8080", {
                    path: "/ws"
                })
                
                instance.$store.state.socket.on("connect", () => { console.log("WebSocket Connected"); r() })
            } else r()
        })
        
    },

    request: function(instance, path, payload) {
        const backend = instance.$store.state.socket;
        return new Promise(resolve => {
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