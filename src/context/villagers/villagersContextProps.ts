import { EntityElementType } from "../../models/EntityElementType";
import { Position } from "../../models/Position";

export type VillagersContextProps = {
  villagers: EntityElementType[];
  setVillagers: (villagers: EntityElementType[]) => void;
  selectVillager: (villagerId: string) => void;
  deselectAllVillagers: () => void;
  moveVillager: (villagerId: string, position: Position) => void;
  trainVillager: (position: Position) => void;
};
