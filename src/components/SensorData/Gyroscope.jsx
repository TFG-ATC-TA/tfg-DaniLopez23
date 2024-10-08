import { socket } from "../../webSockets/socket";
import { useState, useEffect } from "react";

const Gyroscope = () => {
  const [gyroscopeData, setGyroscopeData] = useState(0);

  useEffect(() => {
    const onGyroscopeData = (data) => {
      setGyroscopeData(data);
    };

    socket.on("synthetic-farm-1/6_dof_imu", onGyroscopeData);

    return () => {
      socket.off("synthetic-farm-1/6_dof_imu", onGyroscopeData);
    };
  }, []);

  return (
    <div>
      {gyroscopeData ? (
        <div>
          <p>Gyroscope Data: (Last update: {gyroscopeData.readableDate})</p>
          <p>X: {gyroscopeData.fields.gyro_x} rad/s</p>
          <p>Y: {gyroscopeData.fields.gyro_y} rad/s</p>
          <p>Z: {gyroscopeData.fields.gyro_z} rad/s</p>
        </div>
      ) : (
        <p>Gyroscope Data: no data received yet</p>
      )}
    </div>
  );
};

export default Gyroscope;
