import { socket } from "../WebSockets/Socket";
import { useState, useEffect } from "react";

const Temperature = () => {
  const [temperature, setTemperature] = useState(0);

  useEffect(() => {
    const onTemperature = (data) => {
      console.log(data);
      setTemperature(data.message);
    };

    socket.on("synthetic-farm-1/tank_temperature_probes", onTemperature);

    return () => {
      socket.off("synthetic-farm-1/tank_temperature_probes", onTemperature);
    };
  }, []);

  return (
    <div>
      <p>
        {temperature === 0
          ? "Temperature: no data received yet"
          : `Temperature: ${temperature}`}
      </p>
    </div>
  );
};

export default Temperature;
