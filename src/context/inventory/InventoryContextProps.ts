import { Inventory } from "../../models/Inventory"
import { Price } from "../../models/Price"

export type InventoryContextProps = {
    inventory: Inventory,
    addResources: (resource: Price[]) => void
    reduceResources: (resources: Price[]) => void
    setInventory: (Inventory: Inventory) => void
}