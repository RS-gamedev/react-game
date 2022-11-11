import { Status } from "./enums/Status"
import { VillagerType } from "./enums/VillagerType";
import { InventoryItem } from "./InventoryItem";
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
    inventoryItems: InventoryItem[]
    // nextAction?: any
}