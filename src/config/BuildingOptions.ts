import { BuildingOption } from "../models/BuildingOption";
import { v4 as uuidv4 } from 'uuid';
import { resources } from "./Resources";
import { Position } from "../models/Position";
import { trainVillager } from "../utils/BuildingOptionsUtil";
import { VillagerType } from "../models/enums/VillagerType";



export const buildingOptions: BuildingOption[] = [
    {
        id: uuidv4(),
        name: "Train Villager",
        icon: ['fas', 'tree'],
        toExecute: trainVillager,
        price: [
            { type: resources.find(x => x.name === "Wood"), amount: 50 }
        ],
        type: VillagerType.LUMBERJACK
    },
    {
        id: uuidv4(),
        name: "Upgrade Town center",
        icon: ['fas', 'coins'],
        toExecute: (position: Position) => {},
        price: [
            { type: resources.find(x => x.name === "Coins"), amount: 100 }
        ],
    },
    {
        id: uuidv4(),
        name: "Upgade Villagers",
        icon: ['fas', 'gem'],
        toExecute: (position: Position) => {},
        price: [
            { type: resources.find(x => x.name === "Gem"), amount: 100 }
        ],
    }
]