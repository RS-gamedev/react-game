import { createContext } from "react";
import { BuildingsContextProps } from "./buildingsContextProps";

const initialContext: BuildingsContextProps = {
  buildings: [],
  addBuilding: () => {},
  setBuildings: () => {},
  selectBuilding: () => {},
  deselectAllBuildings: () => {},
};

export const BuildingsContext = createContext<BuildingsContextProps>(initialContext);
