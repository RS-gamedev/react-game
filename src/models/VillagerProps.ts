import { BuildingOption } from "./BuildingOption";
import { BuildingProps } from "./BuildingProps";
import { Status } from "./enums/Status"
import { VillagerType } from "./enums/VillagerType";
import { Hitbox } from "./Hitbox";
import { Inventory } from "./Inventory";
import { InventoryItem } from "./InventoryItem";
import { ObjectProps } from "./ObjectProps";
import { Position } from "./Position";
import {GameTickResult} from "./GameTickResult";

export type VillagerProps = {
    id: string,
    name: string,
    type: VillagerType;
    status: Status;
    goalObjectId?: string;
    inventorySlots: number;
    inventoryItems: InventoryItem[],
    selected: boolean;
    currentTask?: (villagers: VillagerProps[], villagerId: string, inventoryItems: InventoryItem[], buildings: BuildingProps[], mapObjects: ObjectProps[], goalPosition?: Position) => GameTickResult;
    buildingOptions: BuildingOption[];
    hitBox: Hitbox;
    size: {width: string, height: string};
    // nextAction?: any
}