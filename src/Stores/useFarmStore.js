import { create } from "zustand";

const useFarmStore = create((set) => ({
  farmData: {},
  mode: "realtime",
  serverStatus: { status: 'connecting', error: null },
  setFarmData: (data) => set({ farmData: data }),
  setMode: (data) => set({ mode: data }),
  setServerStatus: (data) => set({ serverStatus: data }),
  
}));

export default useFarmStore;
