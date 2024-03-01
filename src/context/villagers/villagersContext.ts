import { createContext } from "react";
import { VillagersContextProps } from "./villagersContextProps";

const initialContext: VillagersContextProps = {
  villagers: [],
  setVillagers: () => {},
  deselectAllVillagers: () => {},
  selectVillager: () => {},
  trainVillager: () => {},
  updateVillagers: () => {},
};

export const VillagersContext = createContext<VillagersContextProps>(initialContext);
