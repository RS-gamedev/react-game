import { BuildingProps } from "../models/BuildingProps";
import { GameTickResult } from "../models/GameTickResult";
import { Inventory } from "../models/Inventory";
import { ObjectProps } from "../models/ObjectProps";
import { VillagerProps } from "../models/VillagerProps";

export function getEmptyGameTickResultObject() {
    return {
        villagers: undefined,
        buildings: undefined,
        mapObjects: undefined,
        inventory: undefined
    }
}


export function executeTasks(villagers: VillagerProps[], inventory: Inventory, mapObjects: ObjectProps[], buildings: BuildingProps[]): GameTickResult {
    let gameTickResult: GameTickResult = getEmptyGameTickResultObject();
    let villagersCopy = [...villagers];
    let inventoryCopy = { ...inventory };
    let mapObjectsCopy = { ...mapObjects };
    let buildingsCopy = [...buildings]

    villagersCopy.forEach(villager => {
        let toUseVillagers = (gameTickResult.villagers) ? gameTickResult.villagers : villagersCopy;
        let toUseInventory = (gameTickResult.inventory)? gameTickResult.inventory : inventoryCopy;
        let toUseMapObjects = (gameTickResult.mapObjects) ? gameTickResult.mapObjects : mapObjectsCopy;
        let toUseBuildings = (gameTickResult.buildings) ? gameTickResult.buildings : buildingsCopy;
        if(!villager.currentTask) return;
        gameTickResult = villager.currentTask(toUseVillagers, villager.id, toUseInventory, toUseBuildings, toUseMapObjects);
    });

    return gameTickResult;
}