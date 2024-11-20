// sensorStore.js
import { create } from "zustand";

const useDataStore = create((set) => ({
  encoderData: null,
  gyroscopeData: null,
  milkQuantityData: null,
  tankTemperaturesData: null,
  switchStatus: null,
  weightData: null,
  airQualityData: null,

  updateEncoderData: (data) => {
    console.log("Encoder data updated:", data);
    set({ encoderData: data });
  },
  updateGyroscopeData: (data) => {
    console.log("Gyroscope data updated:", data);
    set({ gyroscopeData: data });
  },
  updateMilkQuantityData: (data) => {
    console.log("Milk quantity data updated:", data);
    set({ milkQuantityData: data });
  },
  updateTankTemperaturesData: (data) => {
    console.log("Tank temperatures data updated:", data);
    set({ tankTemperaturesData: data });
  },
  updateSwitchStatus: (data) => {
    console.log("Switch status updated:", data);
    set({ switchStatus: data });
  },
  updateWeightData: (data) => {
    console.log("Weight data updated:", data);
    set({ weightData: data });
  },
  updateAirQualityData: (data) => {
    console.log("Air quality data updated:", data);
    set({ airQualityData: data });
  },
}));

export default useDataStore;
