import { create } from "zustand";

const useFarmStore = create((set) => ({
  farms: [],
  selectedFarm: {},
  setFarms: (data) => set({ farms: data }),
  setSelectedFarm: (data) => set({ selectedFarm: data }),
}));

export default useFarmStore;
