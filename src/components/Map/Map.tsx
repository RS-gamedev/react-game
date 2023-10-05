import React, { useState } from "react";
import { InventoryContext } from "../../context/inventory/inventoryContext";
import { useBuildings } from "../../hooks/useBuildings";
import { useInventory } from "../../hooks/useInventory";
import { useMapObjects } from "../../hooks/useMapObjects";
import { useVillagers } from "../../hooks/useVillagers";
import InventoryProvider from "../../providers/InventoryProvider";

// type Villager = {
//     component: React.FC
// }

const Map = () => {
  const {inventory, addResources, reduceResources} = useInventory();

  return
};

const Building = () => {};

const MapObject = () => {};

const Villager = () => {};
