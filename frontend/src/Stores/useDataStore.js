import { create } from "zustand";

const useDataStore = create((set) => ({
  encoderData: null,
  gyroscopeData: null,
  milkQuantityData: null,
  tankTemperaturesData: null,
  switchStatus: null,
  weightData: null,
  airQualityData: null,
  selectedData: null,
  lastSensorData: null,
  
  updateLastSensorData: (data) => set({ lastSensorData: data }),
  updateEncoderData: (data) => set({ encoderData: data }),
  updateGyroscopeData: (data) => set({ gyroscopeData: data }),
  updateMilkQuantityData: (data) => set({ milkQuantityData: data }),
  updateTankTemperaturesData: (data) => set({ tankTemperaturesData: data }),
  updateSwitchStatus: (data) => set({ switchStatus: data }),
  updateWeightData: (data) => set({ weightData: data }),
  updateAirQualityData: (data) => set({ airQualityData: data }),
  setSelectedData: (data) => set({ selectedData: data }),
}));

export default useDataStore;