import { VillagerProps } from "../models/VillagerProps";
import { deselectAllBuildings } from "./BuildingUtils";
import { deselectAllMapObjects } from "./MapObjectUtils";

export function setSelectedVillager(villagers: VillagerProps[], toSelect: VillagerProps) {
    let villagersCopy = [...villagers];
    let selectedVillager = villagersCopy.find(x => x.id === toSelect.id);
    if (selectedVillager) {
        selectedVillager.selected = true;
    }
    villagersCopy.filter(x => x.id !== toSelect.id).forEach(x => x.selected = false);
    return villagersCopy;
}

