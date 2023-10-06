import { createContext } from "react";
import { BuildingsContextProps } from "./buildingsContextProps";

const initialContext: BuildingsContextProps = {
  buildings: [],
  addBuilding: () => {},
  setBuildings: () => {},
  selectBuilding: () => {},
  deselectAll: () => {},
};

export const BuildingsContext = createContext<BuildingsContextProps>(initialContext);
