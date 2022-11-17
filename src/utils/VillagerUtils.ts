import { VillagerProps } from "../models/VillagerProps";

export function setSelectedVillager(villagers: VillagerProps[], toSelect: VillagerProps) {
    let villagersCopy = [...villagers];
    let selectedVillager = villagersCopy.find(x => x.id === toSelect.id);
    if (selectedVillager) {
        selectedVillager.selected = true;
    }
    villagersCopy.filter(x => x.id !== toSelect.id).forEach(x => x.selected = false);
    return villagersCopy;
}

export function inventoryIsFull(villager: VillagerProps): boolean {
    if (villager.inventoryItems[0] && villager.inventoryItems[0].amount == villager.inventorySlots) {
        return true;
    }
    return false;
}