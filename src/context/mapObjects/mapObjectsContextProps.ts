import { EntityElementType } from "../../models/EntityElementType";
import { MapObjectProps } from "../../models/MapObjectProps";
import { Position } from "../../models/Position";

export type MapObjectContextProps = {
  mapObjects: EntityElementType[];
  createMapObjects: (mapObjects: MapObjectProps[]) => void;
  setMapObjects: (mapObjectEntities: EntityElementType[]) => void;
  selectMapObject: (mapObjectId: string) => void;
  deselectAllMapObjects: () => void;
  addMapObject: (mapObject: MapObjectProps, position: Position) => void;
  // nearestMapObject: (position: Position) => string

};
