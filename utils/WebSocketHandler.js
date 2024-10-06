const socketIo = require("socket.io");

class WebSocketHandler {
  constructor(server) {
    this.io = socketIo(server, {
      cors: {
        origin: "http://localhost:5173", // Asegúrate de que esta URL sea la correcta
      },
    });
    this.connectionHandler = null; // Callback to handle new connections
    this.disconnectionHandler = null; // Callback to handle disconnections
  }

  // Method to set the connection handler callback
  onConnection(handler) {
    this.connectionHandler = handler;
  }

  // Method to set the disconnection handler callback
  onDisconnection(handler) {
    this.disconnectionHandler = handler;
  }

  // Initialize the WebSocket server and set up event listeners
  init() {
    this.io.on("connection", (socket) => {
      console.log("New client connected");
      if (this.connectionHandler) {
        this.connectionHandler(socket);
      }

      socket.on("disconnect", () => {
        console.log("Client disconnected");
        if (this.disconnectionHandler) {
          this.disconnectionHandler(socket);
        }
      });
    });
  }

  // Method to emit messages to all connected clients
  emit(event, message) {
    this.io.emit(event, message);
  }
}

module.exports = WebSocketHandler;