import { useState } from "react";
import MapObject from "../components/MapObject/MapObject";
import { MapObjectsContext } from "../context/mapObjects/mapObjectsContext";
import { MapObjectContextProps } from "../context/mapObjects/mapObjectsContextProps";
import { EntityElementType } from "../models/EntityElementType";
import { ObjectProps } from "../models/ObjectProps";

type Props = { children: any };

const MapObjectsProvider = ({ children }: Props) => {
  const [mapObjects, setMapObjects] = useState<EntityElementType[]>([]);
  console.log("Init mapobjectsprovider");
  const onMapObjectClick = (event: any, mapObjectId: string) => {
    event.stopPropagation();
    setMapObjects((prev) => {
      const result = prev?.map((mapObject) => {
        if (mapObject.component.props.id === mapObjectId) {
          return { ...mapObject, selected: true };
        }
        return mapObject;
      });
      return result;
    });
  };

  const createMapObjects = (mapObjects: ObjectProps[]) => {
    console.log("creating Map Objects");
    setMapObjects(
      mapObjects.map((mapObject) => {
        return { component: <MapObject {...mapObject} onClick={(e) => onMapObjectClick(e, mapObject.id)} onRightClick={() => {}} />, selected: false, updated: false };
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
