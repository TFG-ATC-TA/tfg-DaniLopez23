import create from "zustand";

export const useSensorStore = create((set) => ({
  selectedTank: null,
  encoderData: null,
  gyroscopeData: null,
  milkQuantityData: null,
  tankTemperaturesData: null,
  switchStatus: null,
  weightData: null,
  airQualityData: null,

  setSelectedTank: (tankId) => set({ selectedTank: tankId }),
  setEncoderData: (data) => set({ encoderData: data }),
  setGyroscopeData: (data) => set({ gyroscopeData: data }),
  setMilkQuantityData: (data) => set({ milkQuantityData: data }),
  setTankTemperaturesData: (data) => set({ tankTemperaturesData: data }),
  setSwitchStatus: (data) => set({ switchStatus: data }),
  setWeightData: (data) => set({ weightData: data }),
  setAirQualityData: (data) => set({ airQualityData: data }),
}));
