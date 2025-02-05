import { create } from "zustand";

const useFarmStore = create((set) => ({
  farms: [],
  selectedFarm: {},
  mode: "realtime",
  serverStatus: { status: 'connecting', error: null },
  setFarms: (data) => set({ farms: data }),
  setSelectedFarm: (data) => set({ selectedFarm: data }),
  setMode: (data) => set({ mode: data }),
  setServerStatus: (data) => set({ serverStatus: data }),
}));

export default useFarmStore;
