import { useState } from "react";
import MapObject from "../components/MapObject/MapObject";
import { MapObjectsContext } from "../context/mapObjects/mapObjectsContext";
import { MapObjectContextProps } from "../context/mapObjects/mapObjectsContextProps";
import { BuildingElementType } from "../models/Building";
import { ObjectProps } from "../models/ObjectProps";

type Props = { children: any };

const MapObjectsProvider = ({ children }: Props) => {
  const [mapObjects, setMapObjects] = useState<BuildingElementType[]>([]);
  console.log("Init mapobjectsprovider");

  const createMapObjects = (mapObjects: ObjectProps[]) => {
    console.log("creating Map Objects");
    setMapObjects(
      mapObjects.map((mapObject) => {
        return { component: <MapObject {...mapObject} onClick={() => {}} onRightClick={() => {}} />, selected: false, updated: false };
      })
    );
  };

  const value: MapObjectContextProps = {
    mapObjects: mapObjects || [],
    setMapObjects: setMapObjects,
    createMapObjects: createMapObjects,
  };

  return <MapObjectsContext.Provider value={value}>{children}</MapObjectsContext.Provider>;
};

export default MapObjectsProvider;
