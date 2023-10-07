import { EntityElementType } from "../../models/EntityElementType";
import { Inventory } from "../../models/Inventory";
import { Position } from "../../models/Position";
import { VillagerEntity } from "../../models/VillagerEntity";
import { VillagerProps } from "../../models/VillagerProps";

export type VillagersContextProps = {
  villagers: VillagerEntity[];
  setVillagers: (villagers: VillagerEntity[]) => void;
  selectVillager: (villagerId: string) => void;
  deselectAllVillagers: () => void;
  moveVillager: (villagerId: string, position: Position) => void;
  trainVillager: (position: Position) => void;
  updateVillager: (villager: VillagerEntity) => void
  performVillagerActions: (villagers: VillagerEntity[], inventory: Inventory, buildings: EntityElementType[], mapObjects: EntityElementType[]) => void;
  setVillagerAction: (villager: VillagerProps, action: Function) => void;
};
