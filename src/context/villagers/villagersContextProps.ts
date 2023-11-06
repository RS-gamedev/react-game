import { BuildingEntity } from "../../models/BuildingEntity";
import { Inventory } from "../../models/Inventory";
import { MapObjectEntity } from "../../models/MapObjectEntity";
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
  performVillagerActions: (villagers: VillagerEntity[], inventory: Inventory, buildings: BuildingEntity[], mapObjects: MapObjectEntity[]) => { inventory: Inventory | undefined, buildings: BuildingEntity | undefined, mapObjects: MapObjectEntity | undefined } | void
  setVillagerAction: (villager: VillagerProps, action: Function) => void;
};
