import { BuildingProps } from "../../models/BuildingProps";
import { GameTickResult } from "../../models/GameTickResult";
import { Inventory } from "../../models/Inventory";
import { MapObjectProps } from "../../models/MapObjectProps";
import { Position } from "../../models/Position";
import { VillagerProps } from "../../models/VillagerProps";

export type VillagersContextProps = {
  villagers: VillagerProps[];
  setVillagers: (villagers: VillagerProps[]) => void;
  selectVillager: (villagerId: string) => void;
  deselectAllVillagers: () => void;
  trainVillager: (position: Position) => void;
  // setVillagerAction: (
  //   villager: VillagerProps,
  //   action: (
  //     villagers: VillagerProps[],
  //     villagerId: string,
  //     inventory: Inventory,
  //     buildings: BuildingProps[],
  //     mapObjects: MapObjectProps[],
  //     gameTickResult: GameTickResult
  //   ) => GameTickResult
  // ) => void;
  updateVillagers: (villagers: VillagerProps[]) => void;
};
