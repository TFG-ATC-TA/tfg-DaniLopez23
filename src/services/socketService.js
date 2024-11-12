// socketService.js
import { io } from 'socket.io-client';

const URL = 'http://localhost:3001';
const socket = io(URL);

export const subscribeToSensor = (sensor, callback) => {
  socket.on(sensor, callback);
};

export const unsubscribeFromSensor = (sensor) => {
  socket.off(sensor);
};

export const emitEvent = (event, data) => {
  socket.emit(event, data);
};

export default socket;
