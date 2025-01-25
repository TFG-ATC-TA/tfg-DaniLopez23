import { create } from "zustand";

const useSocketStore = create((set, get) => ({
  socket: null,
  serverStatus: "connecting",
  mqttStatus: "connecting",

  setSocket: (socket) => set({ socket }),
  setServerStatus: (status) => set({ serverStatus: status }),
  setMqttStatus: (status) => set({ mqttStatus: status }),

  joinRooms: (boardIds) => {
    const socket = get().socket;
    if (socket && Array.isArray(boardIds)) {
      socket.emit("selectTank", boardIds);
      socket.emit("request last data", boardIds);
    }
  },
}));
export default useSocketStore;
