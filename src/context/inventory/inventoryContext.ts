import { createContext } from "react";
import { Inventory } from "../../models/Inventory";
import { InventoryContextProps } from "./InventoryContextProps";

const initialContext: InventoryContextProps = {
    inventory: { resources: [] },
    addResources: () => { },
    reduceResources: () => { },
    setInventory: () => {}
}

export const InventoryContext = createContext<InventoryContextProps>(initialContext);