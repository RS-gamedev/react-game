import React, { createContext, useContext, useEffect } from "react";
import { BuildingsContextProps } from "../context/buildings/buildingsContextProps";
import { InventoryContextProps } from "../context/inventory/InventoryContextProps";
import { MapObjectContextProps } from "../context/mapObjects/mapObjectsContextProps";
import { VillagersContextProps } from "../context/villagers/villagersContextProps";
import { useBuildings } from "../hooks/useBuildings";
import { useInventory } from "../hooks/useInventory";
import { useMapObjects } from "../hooks/useMapObjects";
import { useVillagers } from "../hooks/useVillagers";
import { BuildingEntity } from "../models/BuildingEntity";
import { Inventory } from "../models/Inventory";
import { MapObjectEntity } from "../models/MapObjectEntity";
import { VillagerEntity } from "../models/VillagerEntity";

interface GameState {
  inventory: { [resource: string]: number };
  // Add other game state properties
}

const initialGameState: GameState = {
  inventory: { wood: 0, stone: 0 /* add more resources */ },
  // Initialize other game state properties
};

type GameContextType = InventoryContextProps &
  MapObjectContextProps &
  BuildingsContextProps &
  VillagersContextProps;

const GameContext = createContext<GameContextType | undefined>(undefined);

const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const inventoryProviderValue = useInventory();
  const mapObjectsProviderValue = useMapObjects();
  const villagerProviderValue = useVillagers();
  const buildingsProviderValue = useBuildings();

  useEffect(() => {
    // Game logic, tick updates, and subscriptions go here
    // Use setState to update the game state based on tick
  }, [inventoryProviderValue.inventory, mapObjectsProviderValue.mapObjects, villagerProviderValue.villagers, buildingsProviderValue.buildings]);

  return (
    <GameContext.Provider value={{ ...inventoryProviderValue, ...mapObjectsProviderValue, ...villagerProviderValue, ...buildingsProviderValue }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

export default GameProvider;
