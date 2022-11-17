import { BuildingProps } from "./BuildingProps";
import { Inventory } from "./Inventory";
import { ObjectProps } from "./ObjectProps";
import { VillagerProps } from "./VillagerProps";

export type GameTickResult = {
    villagers: VillagerProps[] | undefined;
    buildings: BuildingProps[] | undefined;
    mapObjects: ObjectProps[] | undefined;
    inventory: Inventory | undefined;
}