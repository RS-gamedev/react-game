import { useState, useEffect } from "react";
import { MapObjectsContext } from "../context/mapObjects/mapObjectsContext";
import { MapObjectContextProps } from "../context/mapObjects/mapObjectsContextProps";
import { VillagersContextProps } from "../context/villagers/villagersContextProps";
import { ObjectProps } from "../models/ObjectProps";

type Props = { children: any };

const MapObjectsProvider = ({ children }: Props) => {
  const [mapObjects, setMapObjects] = useState<ObjectProps[]>([]);
  console.log("Init mapobjectsprovider");

  const value: MapObjectContextProps = {
    mapObjects: mapObjects || [],
    setMapObjects: setMapObjects,
  };

  useEffect(() => {
    console.log(mapObjects);
  }, [mapObjects]);

  return <MapObjectsContext.Provider value={value}>{children}</MapObjectsContext.Provider>;
};

export default MapObjectsProvider;
