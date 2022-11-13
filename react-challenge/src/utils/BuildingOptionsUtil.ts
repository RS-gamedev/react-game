import { Position } from "../models/Position";
import { VillagerProps } from "../models/VillagerProps";
import { v4 as uuidv4 } from 'uuid';
import { Status } from "../models/enums/Status";
import { VillagerType } from "../models/enums/VillagerType";


export function trainVillager(position: Position){
    let newVillager: VillagerProps = {
        currentTask: undefined,
        id: uuidv4(),
        inventoryItems: [],
        inventorySlots: 10, 
        name: "Villager",
        position: position,
        status: Status.IDLE,
        type: VillagerType.LUMBERJACK
    } 
    return newVillager;
}