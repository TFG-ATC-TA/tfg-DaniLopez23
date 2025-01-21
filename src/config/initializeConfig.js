import DEFAULT_CONFIG from "./config";

let customConfig = { ...DEFAULT_CONFIG }; // Copia del valor por defecto

/**
 * Inicializa la configuración con valores personalizados.
 * @param {Object} newConfig - Un objeto con valores que sobrescribirán la configuración por defecto.
 */
export const initializeConfig = (newConfig = {}) => {
  customConfig = { ...customConfig, ...newConfig };
};

/**
 * Obtiene la configuración actual.
 * @returns {Object} La configuración actual.
 */
export const getConfig = () => customConfig;
