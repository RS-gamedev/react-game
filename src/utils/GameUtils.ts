import { resources } from "../config/Resources";
import { shapes } from "../config/Shapes";
import { BuildingProps } from "../models/BuildingProps";
import { BuildingType } from "../models/enums/BuildingType";
import { Inventory } from "../models/Inventory";
import { ObjectProps } from "../models/ObjectProps";
import { v4 as uuidv4 } from 'uuid';
import { createBuilding } from "./BuildingUtils";

export function setInitialInventory(){
    let wood = resources.find(x => x.name === 'Wood');
    let coins = resources.find(x => x.name === 'Coins');
    let gems = resources.find(x => x.name === 'Gems');
    if (!wood || !coins || !gems) return;
    let inventoryInit: Inventory = {
        resources: [
            {
                resource: coins,
                amount: 500
            },
            {
                resource: wood,
                amount: 200
            },
            {
                resource: gems,
                amount: 0
            }
        ]
    }
    return inventoryInit;
}

export function setInitialBuildings(){
    let townCenter = shapes.find(x => x.type === BuildingType.TOWN_CENTER);
    if (townCenter) {
        
        let initialBuildings: BuildingProps[] = [createBuilding({x: 500, y: 300}, BuildingType.TOWN_CENTER)!];
        if (initialBuildings) {
            return initialBuildings
        }
    }
    return [];
}

export function setInitialMapObjects(map: any){
    let initialMapObjects: ObjectProps[] = map.map.map((x: any) => { return { id: uuidv4(), name: x.name, position: x.position, selected: false } });
    return initialMapObjects;
}