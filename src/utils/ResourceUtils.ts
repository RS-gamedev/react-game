import { Inventory } from "../models/Inventory";
import { InventoryItem } from "../models/InventoryItem";
import { Price } from "../models/Price";
import { Resource } from "../models/Resource";
import { canAfford } from "./GameUtils";

function reduceResource(inventoryItem: InventoryItem, amount: number) {
    if (inventoryItem) {
        let newAmount = inventoryItem.amount -= amount;
        if (newAmount >= 0) {
            inventoryItem.amount = newAmount
        }
        return null;
    }
    return inventoryItem;
}

export function reduceResourcesFromInventory(inventory: Inventory, prices: Price[]): [Inventory, boolean]{
    let inventoryCopy = { ...inventory };
    let resourcesCopy = [...inventoryCopy.resources];
    if (!canAfford(resourcesCopy, prices)) return [inventory, false];
    prices.forEach(price => {
        let toReduceResource = inventoryCopy.resources.find(x => x.resource.id === price.type?.id);
        if (toReduceResource && toReduceResource.resource) {
            let reducedInventoryItem = reduceResource(toReduceResource, price.amount);
            if (!reducedInventoryItem) return [inventory, false];
            toReduceResource = reducedInventoryItem;
        }
        else{
            return [inventory, false];
        }
    });

    return [inventoryCopy, true];
}