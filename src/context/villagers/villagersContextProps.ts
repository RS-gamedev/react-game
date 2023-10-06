import { EntityElementType } from "../../models/EntityElementType";
import { Position } from "../../models/Position";
import { VillagerProps } from "../../models/VillagerProps";

export type VillagersContextProps = {
  villagers: EntityElementType[];
  setVillagers: (villagers: VillagerProps[]) => void;
  selectVillager: (villagerId: string) => void;
  deselectAllVillagers: () => void;
  moveVillager: (villagerId: string, position: Position) => void;
  trainVillager: (position: Position) => void;
};
