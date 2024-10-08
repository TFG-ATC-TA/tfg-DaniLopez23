import { socket } from "../../webSockets/socket";
import { useState, useEffect } from "react";

const TankTemperatures = () => {
  const [temperatures, setTemperatures] = useState(0);

  useEffect(() => {
    const onTemperature = (data) => {
      console.log(data);
      setTemperatures(data);
    };

    socket.on("synthetic-farm-1/tank_temperature_probes", onTemperature);

    return () => {
      socket.off("synthetic-farm-1/tank_temperature_probes", onTemperature);
    };
  }, []);

  return (
    <>
      {temperatures ? (
        <div>
          <p>Tank temperatures Data: (Last update: {temperatures.readableDate})</p>
          <p>Submerged temperature {temperatures.submerged_temperature} Cº</p>
          <p>Surface temperature {temperatures.surface_temperature} Cº</p>
          <p>Over surface temperature {temperatures.over_surface_temperature} Cº</p>
        </div>
      ) : (
        <p>Tank temperatures Data: no data received yet</p>
      )}
    </>
  );
};

export default TankTemperatures;
