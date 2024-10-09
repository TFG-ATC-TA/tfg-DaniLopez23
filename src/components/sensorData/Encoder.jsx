import { socket } from "../../webSockets/socket";
import { useState, useEffect } from "react";

const Encoder = () => {
  const [encoderData, setEncoderData] = useState(null);

  useEffect(() => {
    const onEncoderData = (data) => {
      console.log(data);
      setEncoderData(data);
    };

    socket.on("synthetic-farm-1/encoder", onEncoderData);

    return () => {
      socket.off("synthetic-farm-1/encoder", onEncoderData);
    };
  }, []);

  return (
    <>
      {encoderData ? (
        <div>
          <p>Encoder Data: (Last Update: {encoderData.redeableDate})</p>
          <p>{encoderData.rpm} rad/s</p>
        </div>
      ) : (
        <p>Encoder Data: no data received yet</p>
      )}
    </>
  );
};

export default Encoder;
