import { BuildingOption } from "./BuildingOption";
import { BuildingProps } from "./BuildingProps";
import { Status } from "./enums/Status"
import { VillagerType } from "./enums/VillagerType";
import { Inventory } from "./Inventory";
import { InventoryItem } from "./InventoryItem";
import { ObjectProps } from "./ObjectProps";
import { Position } from "./Position";

export type VillagerProps = {
    id: string,
    name: string,
    position: {
        x: number,
        y: number
    },
    type: VillagerType;
    status: Status;
    goalPosition?: Position;
    inventorySlots: number;
    inventoryItems: InventoryItem[],
    selected: boolean;
    currentTask?: (villager: VillagerProps, inventory: Inventory, buildings: BuildingProps[], mapObjects: ObjectProps[], goalPosition?: Position) => VillagerProps;
    buildingOptions: BuildingOption[];
    // nextAction?: any
}