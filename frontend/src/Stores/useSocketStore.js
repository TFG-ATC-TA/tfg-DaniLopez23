import { create } from "zustand";

const useSocketStore = create((set, get) => ({
  socket: null,
  mqttStatus: { status: 'connecting', error: null },
  webSocketServerStatus: { status: 'connecting', error: null },
  setSocket: (socket) => set({ socket }),
  setMqttStatus: (status) => set({ mqttStatus: status }),
  setWebSocketServerStatus: (status) => set({ webSocketServerStatus: status }),

  joinRooms: (boardIds, farmId) => {
    const socket = get().socket;
    if (socket && Array.isArray(boardIds)) {
      console.log("Joining rooms", farmId, boardIds);
      socket.emit("selectTank", farmId, boardIds);
      socket.emit("requestLastData", farmId, boardIds);
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
