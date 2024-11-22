import { useEffect } from "react";
import { getFarm, getBoardsByTank } from "../services/farm";
import  useDataStore  from "../Stores/useDataStore";
import useTankStore from "../Stores/useTankStore";

const useFarmData = () => {

  const {setFarmData} = useDataStore((state) => (state))
  const {setSelectedTank, setBoardsByTank} = useTankStore((state) => (state))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFarm();
        setFarmData(data);

        if (data && data.equipments) {
          const boards = getBoardsByTank(data);
          setBoardsByTank(boards);

          const firstMilkTank = data.equipments.find(
            (tank) => tank.type === "Tanque de leche"
          );
          if (firstMilkTank) {
            setSelectedTank(firstMilkTank);
          }
        } else {
          console.log("No equipment data found in farm data");
        }
      } catch (error) {
        console.error("Error fetching farm data:", error);
      }
    };

    fetchData();
  }, []);

};

export default useFarmData;