import { EntityElementType } from "../../models/EntityElementType";
import { ObjectProps } from "../../models/ObjectProps";
import { Position } from "../../models/Position";

export type MapObjectContextProps = {
  createMapObjects: (mapObjects: ObjectProps[]) => void;
  mapObjects: EntityElementType[];
  setMapObjects: (mapObjectEntities: EntityElementType[]) => void
  selectMapObject: (mapObjectId: string) => void;
  deselectAllMapObjects: () => void;
  addMapObject: (mapObject: ObjectProps, position: Position) => void;
};
