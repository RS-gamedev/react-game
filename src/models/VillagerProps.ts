import { BuildingOption } from "./BuildingOption";
import { BuildingProps } from "./BuildingProps";
import { Status } from "./enums/Status"
import { VillagerType } from "./enums/VillagerType";
import { Hitbox } from "./Hitbox";
import { Inventory } from "./Inventory";
import { InventoryItem } from "./InventoryItem";
import { ObjectProps } from "./ObjectProps";
import { Position } from "./Position";

export type VillagerProps = {
    id: string,
    name: string,
    type: VillagerType;
    status: Status;
    goalPosition?: Position;
    inventorySlots: number;
    inventoryItems: InventoryItem[],
    selected: boolean;
    currentTask?: (villager: VillagerProps, invent: [inventory: Inventory, setInventory: any], buildings: BuildingProps[], mapObjects: ObjectProps[], goalPosition?: Position) => VillagerProps;
    buildingOptions: BuildingOption[];
    hitBox: Hitbox;
    size: {width: string, height: string};
    // nextAction?: any
}