import { createContext } from "react";
import { VillagersContextProps } from "./villagersContextProps";

const initialContext: VillagersContextProps = {
  villagers: [],
  setVillagers: () => {},
  deselectAllVillagers: () => {},
  selectVillager: () => {},
  trainVillager: () => {},
  setVillagerAction: () => {},
  updateVillagers: () => {},
};

export const VillagersContext = createContext<VillagersContextProps>(initialContext);
