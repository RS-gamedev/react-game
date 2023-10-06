import { createContext } from "react";
import { VillagersContextProps } from "./villagersContextProps";

const initialContext: VillagersContextProps = {
    villagers: [],
    setVillagers: () => { },
    deselectAllVillagers: () => {},
    moveVillager: () => {},
    selectVillager: () => {},
    trainVillager: () => {}
}

export const VillagersContext = createContext<VillagersContextProps>(initialContext);