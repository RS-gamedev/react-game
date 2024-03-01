import { EntityElementType } from "../../models/EntityElementType";
import { MapObjectProps } from "../../models/MapObjectProps";
import { Position } from "../../models/Position";

export type MapObjectContextProps = {
  mapObjects: MapObjectProps[];
  createMapObjects: (mapObjects: MapObjectProps[]) => void;
  setMapObjects: (mapObjectEntities: MapObjectProps[]) => void;
  selectMapObject: (mapObjectId: string) => void;
  deselectAllMapObjects: () => void;
  addMapObject: (mapObject: MapObjectProps, position: Position) => void;
  // nearestMapObject: (position: Position) => string

};
