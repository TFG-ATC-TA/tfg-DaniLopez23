import { create } from "zustand";

const useDataStore = create((set) => ({
  encoderData: null,
  gyroscopeData: null,
  milkQuantityData: null,
  tankTemperaturesData: null,
  switchStatus: null,
  weightData: null,
  airQualityData: null,
  farmData: {},
  selectedData: null,
  mode: "realtime",

  setFarmData: (data) => set({ farmData: data }),
  updateEncoderData: (data) => set({ encoderData: data }),
  updateGyroscopeData: (data) => set({ gyroscopeData: data }),
  updateMilkQuantityData: (data) => set({ milkQuantityData: data }),
  updateTankTemperaturesData: (data) => set({ tankTemperaturesData: data }),
  updateSwitchStatus: (data) => set({ switchStatus: data }),
  updateWeightData: (data) => set({ weightData: data }),
  updateAirQualityData: (data) => set({ airQualityData: data }),
  setSelectedData: (data) => set({ selectedData: data }),
  setMode: (data) => set({ mode: data }),
}));

export default useDataStore;