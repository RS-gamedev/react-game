import { Inventory } from "../models/Inventory";
import { InventoryItem } from "../models/InventoryItem";
import { Price } from "../models/Price";
import { Resource } from "../models/Resource";

export function canAfford(inventoryItems?: InventoryItem[], price?: Price[]) : boolean{
    if(!inventoryItems || !price) return false;
    let toReturn = true;
    inventoryItems.forEach(inventItem => {
        let toCheckPrice = price.find(x => x.type?.id == inventItem.resource.id);
        if(toCheckPrice && inventItem.amount <= toCheckPrice.amount){
            toReturn = false;
        }
    });
    return toReturn;
}

