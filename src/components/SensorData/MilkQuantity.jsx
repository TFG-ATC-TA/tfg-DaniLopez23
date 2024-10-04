import { socket } from "../WebSockets/Socket";
import { useState, useEffect } from "react";

const MilkQuantity = () => {
  const [milkQuantity, setMilkQuantity] = useState(0);

  useEffect(() => {
    const onMilkQuantity = (data) => {
      console.log(data);
      setMilkQuantity(data.message);
    };

    socket.on("synthetic-farm-1/tank_distance", onMilkQuantity);

    return () => {
      socket.off("synthetic-farm-1/tank_distance", onMilkQuantity);
    };
  }, []);

  return (
    <div>
      <p>
        {milkQuantity === 0
          ? "Milk quantity: no data received yet"
          : `Milk quantity: ${milkQuantity}`}
      </p>
    </div>
  );
};

export default MilkQuantity;
