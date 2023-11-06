import { EntityElementType } from "../../models/EntityElementType";
import { MapObjectEntity } from "../../models/MapObjectEntity";
import { MapObjectProps } from "../../models/MapObjectProps";
import { Position } from "../../models/Position";

export type MapObjectContextProps = {
  mapObjects: MapObjectEntity[];
  createMapObjects: (mapObjects: MapObjectProps[]) => void;
  setMapObjects: (mapObjectEntities: MapObjectEntity[]) => void;
  selectMapObject: (mapObjectId: string) => void;
  deselectAllMapObjects: () => void;
  addMapObject: (mapObject: MapObjectProps, position: Position) => void;
  // nearestMapObject: (position: Position) => string

};
