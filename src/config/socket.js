
const { Server } = require("socket.io")
let io
exports.inicializarSocket = (server) => {
    io = new Server(server)

    io.on("connection", (socket) => {
        console.log("Cliente conectado ao Socket.IO")

        socket.on("disconnect", () => {
            console.log("Cliente desconectado")
        })
    })

    return io
}

exports.obterIO = () => {
    if(!io){
        throw new Error("Socket.IO ainda não foi inicializado");
    }

    return io
}