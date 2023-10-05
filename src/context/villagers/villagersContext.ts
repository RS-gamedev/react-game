import { createContext } from "react";
import { VillagersContextProps } from "./villagersContextProps";

const initialContext: VillagersContextProps = {
    setVillagers: () => { },
    villagers: []
}

export const VillagersContext = createContext<VillagersContextProps>(initialContext);