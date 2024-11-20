import { useEffect } from "react";
import useSocketStore from "@/Stores/useSocketStore"; // Importar el store para acceder al socket
import useTankStore from "@/Stores/useTankStore";

export const useTank = () => {
  const { selectTank, selectedTank } = useTankStore((state) => state); // Obtener el tanque seleccionado y la función de selección
  const { joinRoom, leaveRoom } = useSocketStore((state) => state); // Obtener el socket y las funciones de unirse/salir de rooms
    
  
  useEffect(() => {
    if (selectedTank) {
      // Unirse a la room del tanque seleccionado al cambiar de tanque
      joinRoom(selectedTank._id); // Asumiendo que 'roomName' es el identificador único de la room para el tanque

      // Limpiar la suscripción y salir de la room cuando el tanque cambie o cuando el componente se desmonte
      return () => {
        leaveRoom(selectedTank._id); // Salir de la room del tanque seleccionado
      };
    }
  }, [selectedTank, joinRoom, leaveRoom]); // Dependencias actualizadas para garantizar la correcta ejecución

  return { selectedTank, selectTank }; // Retornar el tanque seleccionado y la función para cambiar el tanque
};
