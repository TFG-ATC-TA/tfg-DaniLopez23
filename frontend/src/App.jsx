import Header from "./components/Header";
import DigitalTwin from "./components/DigitalTwin";

import { useSocketInitialization } from "./hooks/useSocketInitialization";
import { useFarmInitialization } from "./hooks/useFarmInitialization";
import useAppDataStore from "./stores/useAppDataStore";

export default function App() {
  
  useFarmInitialization();

  useSocketInitialization();
    
  const { filters } = useAppDataStore((state) => state.filters);
  console.log(filters);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <DigitalTwin />
    </div>
  );
}
