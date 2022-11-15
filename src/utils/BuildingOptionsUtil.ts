import { Position } from "../models/Position";
import { VillagerProps } from "../models/VillagerProps";
import { v4 as uuidv4 } from 'uuid';
import { Status } from "../models/enums/Status";
import { VillagerType } from "../models/enums/VillagerType";


export function trainVillager(position: Position){
    let newVillager: VillagerProps = {
        selected: false,
        currentTask: undefined,
        id: uuidv4(),
        inventoryItems: [],
        inventorySlots: 10, 
        name: "Villager",
        status: Status.IDLE,
        type: VillagerType.LUMBERJACK,
        buildingOptions: [],
        size: {
            width: '50px',
            height: '50px'
        },
        hitBox: {
            leftTop: {
                x: position.x - 25,
                y: position.y - 25
            },
            rightBottom: {
                x: position.x + 25,
                y: position.y + 25
            }
        }
    } 
    return newVillager;
}