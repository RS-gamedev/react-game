import { useState } from "react";
import { VillagersContext } from "../context/villagers/villagersContext";
import { VillagersContextProps } from "../context/villagers/villagersContextProps";
import { VillagerProps } from "../models/VillagerProps";

type Props = { children: any };

const VillagersProvider = ({ children }: Props) => {
  const [villagers, setVillagers] = useState<VillagerProps[]>([]);

  const value: VillagersContextProps = {
    villagers: villagers,
    setVillagers: setVillagers,
  };

  return <VillagersContext.Provider value={value}>{children}</VillagersContext.Provider>;
};

export default VillagersProvider;
