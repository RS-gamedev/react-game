import { BuildingOption } from "./BuildingOption";
import { BuildingProps } from "./BuildingProps";
import { Status } from "./enums/Status"
import { Hitbox } from "./Hitbox";
import { InventoryItem } from "./InventoryItem";
import { ObjectProps } from "./ObjectProps";
import { Position } from "./Position";
import {GameTickResult} from "./GameTickResult";
import { Price } from "./Price";
import { VillagerProfession } from "./VillagerProfession";

export type VillagerProps = {
    id: string,
    name: string,
    status: Status;
    goalObjectId?: string;
    inventorySlots: number;
    inventoryItems: InventoryItem[],
    price: Price[];
    selected: boolean;
    currentTask?: (villagers: VillagerProps[], villagerId: string, inventoryItems: InventoryItem[], buildings: BuildingProps[], mapObjects: ObjectProps[], goalPosition?: Position) => GameTickResult;
    buildingOptions: BuildingOption[];
    hitBox: Hitbox;
    size: {width: string, height: string};
    professions: VillagerProfession[];
}