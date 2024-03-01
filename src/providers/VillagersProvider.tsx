import { useCallback, useEffect, useReducer } from "react";
import { VillagersContext } from "../context/villagers/villagersContext";
import { VillagersContextProps } from "../context/villagers/villagersContextProps";
import { Position } from "../models/Position";
import { VillagerProps } from "../models/VillagerProps";
import { createVillager } from "../utils/BuildingOptionsUtil";

// Action types
type ActionType =
  | { type: "SELECT"; payload: string }
  | { type: "OVERWRITE"; payload: (position: Position) => VillagerProps[] }
  | { type: "SET"; payload: VillagerProps[] }
  | { type: "DESELECT"; payload: string }
  | { type: "DESELECT_ALL"; payload: null }
  | { type: "UPDATE"; payload: VillagerProps[] }
  | { type: "ADD"; payload: { villager: VillagerProps; position: Position } };

function reducer(state: VillagerProps[], action: ActionType): VillagerProps[] {
  switch (action.type) {
    case "SELECT":
      console.log("in reducer - selecting with id: " + action.payload);
      const newStateSelect = state.map((villagerEntity) => {
        if (villagerEntity.id === action.payload) {
          return { ...villagerEntity, selected: true };
        }
        return villagerEntity;
      });
      return areArraysEqual(state, newStateSelect) ? state : newStateSelect;
    case "ADD":
      const newVillagerEntity = action.payload.villager;
      return [...state, newVillagerEntity];
    case "OVERWRITE":
      return action.payload({ x: document.documentElement.clientHeight / 2, y: document.documentElement.clientHeight / 2 });
    case "DESELECT_ALL":
      const newStateDeselect = state.map((villagerEntity) => {
        if (villagerEntity.selected) {
          return { ...villagerEntity, selected: false };
        }
        return villagerEntity;
      });
      return areArraysEqual(state, newStateDeselect) ? state : newStateDeselect;
    case "SET":
      return action.payload;
    case "UPDATE":
      const updatedVillagerIds = new Set(action.payload.map((v) => v.id));
      const newStateUpdate = state.map((villagerEntity) => {
        if (updatedVillagerIds.has(villagerEntity.id)) {
          return action.payload.find((vill) => vill.id === villagerEntity.id) || villagerEntity;
        }
        return villagerEntity;
      });
      return areArraysEqual(state, newStateUpdate) ? state : newStateUpdate;
    default:
      return state;
  }
}

function areArraysEqual(arr1: VillagerProps[], arr2: VillagerProps[]): boolean {
  const result = JSON.stringify(arr1) === JSON.stringify(arr2);
  console.log(result);
  return result;
}
type Props = { children: any };

const VillagersProvider = ({ children }: Props) => {
  const [villagers, dispatch] = useReducer(reducer, []);

  const selectVillager = (villagerId: string) => {
    dispatch({ type: "SELECT", payload: villagerId });
  };

  const setVillagers = useCallback((villagers: VillagerProps[]) => {
    dispatch({ type: "SET", payload: villagers });
  }, []);

  const deselectAllVillagers = useCallback(() => {
    dispatch({ type: "DESELECT_ALL", payload: null });
  }, []);

  const trainVillager = useCallback((position: Position) => {
    const newVillager = createVillager(position);
    dispatch({ type: "ADD", payload: { position: position, villager: newVillager } });
  }, []);

  const updateVillagers = useCallback((villagers: VillagerProps[]) => {
    dispatch({ type: "UPDATE", payload: villagers });
  }, []);

  // const setVillagerAction = (
  //   villager: VillagerProps,
  //   action: (
  //     villagers: VillagerProps[],
  //     villagerId: string,
  //     inventory: Inventory,
  //     buildings: BuildingProps[],
  //     mapObjects: MapObjectProps[],
  //     gameTickResult: GameTickResult
  //   ) => GameTickResult
  // ) => {
  // };

  const value: VillagersContextProps = {
    villagers: villagers,
    selectVillager: selectVillager,
    setVillagers: setVillagers,
    deselectAllVillagers: deselectAllVillagers,
    trainVillager: trainVillager,
    updateVillagers: updateVillagers,
  };

  return <VillagersContext.Provider value={value}>{children}</VillagersContext.Provider>;
};

export default VillagersProvider;
