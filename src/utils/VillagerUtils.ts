import { VillagerProps } from "../models/VillagerProps";

export function inventoryIsFull(villager: VillagerProps): boolean {
    if (villager.inventoryItems[0] && villager.inventoryItems[0].amount == villager.inventorySlots) {
        return true;
    }
    return false;
}