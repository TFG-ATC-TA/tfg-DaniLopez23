import { create } from "zustand";

const useFarmStore = create((set) => ({
  farmData: {},
  mode: "realtime",
  serverStatus: "connecting",
  mqttStatus: "connecting",
  setFarmData: (data) => set({ farmData: data }),
  setMode: (data) => set({ mode: data }),
  setServerStatus: (data) => set({ serverStatus: data }),
  setMqttStatus: (data) => set({ mqttStatus: data }),
}));

export default useFarmStore;
