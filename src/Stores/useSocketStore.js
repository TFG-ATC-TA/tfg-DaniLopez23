import { create } from "zustand";

const useSocketStore = create((set, get) => ({
  socket: null,
  serverStatus: "disconnected",

  setSocket: (socket) => set({ socket }),
  setServerStatus: (status) => set({ serverStatus: status }),

  joinRooms: (boardIds) => {
    const socket = get().socket;
    if (socket && Array.isArray(boardIds)) {
      socket.emit("selectTank", boardIds);
      socket.emit("request last data", boardIds);
    }
  },
}));
export default useSocketStore;
