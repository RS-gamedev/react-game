import { VillagerProps } from "../models/VillagerProps";
import { add } from "./ResourceUtils";

export function inventoryIsFull(villager: VillagerProps): boolean {
  let totalInInventory = 0;
  villager.inventoryItems.forEach((x) => (totalInInventory = add(totalInInventory, x.amount)));
  if (totalInInventory >  villager.inventorySlots - 0.1 && totalInInventory < villager.inventorySlots + 0.1) {
    return true;
  }
  return false;
}
