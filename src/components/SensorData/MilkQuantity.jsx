import { socket } from "../../webSockets/socket";
import { useState, useEffect } from "react";

const MilkQuantity = () => {
  const [milkQuantityData, setMilkQuantityData] = useState(0);

  useEffect(() => {
    const onMilkQuantity = (data) => {
      console.log(data);
      setMilkQuantity(data);
    };

    socket.on("synthetic-farm-1/tank_distance", onMilkQuantity);

    return () => {
      socket.off("synthetic-farm-1/tank_distance", onMilkQuantity);
    };
  }, []);

  return (
    <>
      {milkQuantityData ? (
        <div>
          <p>Milk quantity Data: (Last update: {milkQuantityData.readableDate})</p>
          <p>Milk quantity {milkQuantityData.milkQuantity} %</p>
        </div>
      ) : (
        <p>Milk quantity Data: no data received yet</p>
      )}
    </>
  );
};

export default MilkQuantity;
