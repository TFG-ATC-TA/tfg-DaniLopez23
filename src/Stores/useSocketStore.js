import {create} from "zustand";

const useSocketStore = create((set) => ({
  socket: null,
  serverStatus: "disconnected",
  setSocket: (socket) => set({ socket }),
  setServerStatus: (status) => set({ serverStatus: status }),
}));

export default useSocketStore;
