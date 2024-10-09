import { socket } from "../../webSockets/socket";
import { useState, useEffect } from "react";

const MilkQuantity = ({milkQuantityData}) => {
  // const [milkQuantityData, setMilkQuantityData] = useState(0);

  // useEffect(() => {
  //   const onMilkQuantity = (data) => {
  //     console.log(data);
  //     setMilkQuantityData(data);
  //   };

  //   socket.on("synthetic-farm-1/tank_distance", onMilkQuantity);

  //   return () => {
  //     socket.off("synthetic-farm-1/tank_distance", onMilkQuantity);
  //   };
  // }, []);

  return (
    <>
      {milkQuantityData !== 0 ? (
        <div>
          <p>Milk quantity Data: (Last update: {milkQuantityData.readableDate})</p>
          <p>{milkQuantityData.milkQuantity} %</p>
        </div>
      ) : (
        <p>Milk quantity Data: no data received yet</p>
      )}
    </>
  );
};

export default MilkQuantity;
