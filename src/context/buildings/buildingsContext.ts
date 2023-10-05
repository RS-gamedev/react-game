import { createContext } from "react";
import { BuildingsContextProps } from "./buildingsContextProps";

const initialContext: BuildingsContextProps = {
    buildings: [],
    addBuilding: () => {},
    setBuildings: () => {},
}

export const BuildingsContext = createContext<BuildingsContextProps>(initialContext);