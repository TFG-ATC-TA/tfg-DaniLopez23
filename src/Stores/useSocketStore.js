import { create } from "zustand";

const useSocketStore = create((set, get) => ({
  socket: null,
  mqttStatus: { connectionState: 'connecting', error: null },
  webSocketServerStatus: { connectionState: 'connecting', error: null },
  setSocket: (socket) => set({ socket }),
  setMqttStatus: (status) => set({ mqttStatus: status }),
  setWebSocketServerStatus: (status) => set({ webSocketServerStatus: status }),

  joinRooms: (boardIds) => {
    const socket = get().socket;
    if (socket && Array.isArray(boardIds)) {
      socket.emit("selectTank", boardIds);
      socket.emit("request last data", boardIds);
    }
  },

  reconnectBroker : () => {
    const socket = get().socket;
    console.log("Reconnecting to MQTT Broker");
    if (socket) {
      socket.emit("reconnectMQTT");
    }
  },

}));
export default useSocketStore;
