import Header from "./components/Header";
import DigitalTwin from "./components/DigitalTwin";

import { useSocketInitialization } from "./hooks/useSocketInitialization";
import { useFarmInitialization } from "./hooks/useFarmInitialization";

export default function App() {
  
  useFarmInitialization();

  useSocketInitialization();

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <DigitalTwin />
    </div>
  );
}
