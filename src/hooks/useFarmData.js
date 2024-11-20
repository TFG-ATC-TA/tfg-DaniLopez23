import { useEffect, useState } from "react";
import { getFarm } from "../services/farm";

const useFarmData = () => {
  const [farmData, setFarmData] = useState({});
  const [selectedTank, setSelectedTank] = useState(null);

  useEffect(() => {
    getFarm().then((data) => {
      setFarmData(data);
      if (data.equipments && data.equipments.length > 0) {
        setSelectedTank(data.equipments[0]);
      }
    });
  }, []);

  return { farmData, selectedTank, setSelectedTank };
};

export default useFarmData;
