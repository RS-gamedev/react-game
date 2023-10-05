import { useState } from "react";
import { resources } from "../config/Resources";
import { InventoryContext } from "../context/inventory/inventoryContext";
import { InventoryContextProps } from "../context/inventory/InventoryContextProps";
import { Inventory } from "../models/Inventory";
import { Price } from "../models/Price";
import { setInitialInventory } from "../utils/GameUtils";
import { reduceResourcesFromInventory } from "../utils/ResourceUtils";

type Props = { children: any };

const InventoryProvider = ({ children }: Props) => {
  const [inventory, setInventory] = useState<Inventory>(setInitialInventory()!);

  const reduceResources = (resources: Price[]) => {
    if (!inventory) return false;
    const [result, success] = reduceResourcesFromInventory(inventory, resources);
    if (success) setInventory(result);
    return success;
  };

  const addResources = (resources: Price[]) => {
    return true;
  };

  const value: InventoryContextProps = {
    reduceResources: reduceResources,
    addResources: addResources,
    inventory: inventory!,
    setInventory: setInventory
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};

export default InventoryProvider;