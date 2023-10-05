import { createContext } from "react";
import { MapObjectContextProps } from "./mapObjectsContextProps";

const initialContext: MapObjectContextProps = {
    mapObjects: [],
    setMapObjects: () => {},
}

export const MapObjectsContext = createContext<MapObjectContextProps>(initialContext);