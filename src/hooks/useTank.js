// useTank.js
import { useEffect } from 'react';
import { socket } from './socket'; // Importa tu instancia de socket configurada
import { useSensorStore } from './useSensorStore';

export const useTank = () => {
    const { selectedTank, setSelectedTank, updateSensorData } = useSensorStore();

    // Función para cambiar el tanque seleccionado
    const selectTank = (tankId) => {
        setSelectedTank(tankId);
    };

    useEffect(() => {
        if (selectedTank) {
            // Emitir al servidor para unirse a la room del tanque seleccionado
            socket.emit('joinRoom', { tankId: selectedTank });

            // Escuchar los datos del sensor solo para el tanque seleccionado
            socket.on('sensorData', (data) => {
                const { sensorId, sensorData } = data;
                updateSensorData(sensorId, sensorData);
            });

            // Limpiar la suscripción al cambiar de tanque o al desmontar el componente
            return () => {
                socket.emit('leaveRoom', { tankId: selectedTank });
                socket.off('sensorData');
            };
        }
    }, [selectedTank, updateSensorData]);

    return { selectedTank, selectTank };
};
