import { useReducer } from "react";
import Villager from "../components/Villager/Villager";
import { VillagersContext } from "../context/villagers/villagersContext";
import { VillagersContextProps } from "../context/villagers/villagersContextProps";
import { BuildingProps } from "../models/BuildingProps";
import { GameTickResult } from "../models/GameTickResult";
import { Inventory } from "../models/Inventory";
import { MapObjectProps } from "../models/MapObjectProps";
import { Position } from "../models/Position";
import { VillagerEntity } from "../models/VillagerEntity";
import { VillagerProps } from "../models/VillagerProps";
import { createVillager } from "../utils/BuildingOptionsUtil";

const createVillagerEntity = (villager: VillagerProps): VillagerEntity => {
  return {
    component: <Villager {...villager} />,
    villager: villager,
  };
};

// Action types
type ActionType =
  | { type: "SELECT"; payload: string }
  | { type: "OVERWRITE"; payload: (position: Position) => VillagerEntity[] }
  | { type: "SET"; payload: VillagerEntity[] }
  | { type: "DESELECT"; payload: string }
  | { type: "DESELECT_ALL"; payload: null }
  | { type: "UPDATE"; payload: VillagerProps[] }
  | { type: "ADD"; payload: { villager: VillagerProps; position: Position } }
  | {
      type: "SET_ACTION";
      payload: {
        villager: VillagerProps;
        action: (
          villagers: VillagerProps[],
          villagerId: string,
          inventory: Inventory,
          buildings: BuildingProps[],
          mapObjects: MapObjectProps[],
          gameTickResult: GameTickResult
        ) => GameTickResult;
      };
    };

function reducer(state: VillagerEntity[], action: ActionType): VillagerEntity[] {
  switch (action.type) {
    case "SELECT":
      return [
        ...state.map((villagerEntity) => {
          if (villagerEntity.villager.id === action.payload) {
            const updatedVillagerProps = { ...villagerEntity.villager, selected: true };
            return createVillagerEntity(updatedVillagerProps);
          }
          return villagerEntity;
        }),
      ];
    case "ADD":
      const newVillagerEntity = createVillagerEntity(action.payload.villager);
      return [...state.map((villagerEntity) => villagerEntity), newVillagerEntity];
    case "OVERWRITE":
      return action.payload({ x: document.documentElement.clientHeight / 2, y: document.documentElement.clientHeight / 2 });
    case "DESELECT_ALL":
      if (state.find((villagerEntity) => villagerEntity.villager.selected)) {
        return [
          ...state.map((villagerEntity) => {
            if (!villagerEntity.villager.selected) return villagerEntity;
            const updatedVillagerProps = { ...villagerEntity.villager, selected: false };
            return createVillagerEntity(updatedVillagerProps);
          }),
        ];
      }
      return state;
    case "SET":
      return action.payload;
    case "UPDATE":
      const updatedVillagerIds = new Set(action.payload.map((v) => v.id));
      return [
        ...state.map((villagerEntity) => {
          if (!updatedVillagerIds.has(villagerEntity.villager.id)) return villagerEntity;
          return createVillagerEntity(action.payload.find((vill) => vill.id === villagerEntity.villager.id) || villagerEntity.villager);
        }),
      ];
    case "SET_ACTION":
      return [
        ...state.map((villagerEntity) => {
          if (villagerEntity.villager.id === action.payload.villager.id) {
            const updatedVillagerProps = { ...villagerEntity.villager, currentAction: action.payload.action };
            const newV = createVillagerEntity(updatedVillagerProps);
            return newV;
          }
          return villagerEntity;
        }),
      ];
    default:
      return state;
  }
}
type Props = { children: any };

const VillagersProvider = ({ children }: Props) => {
  const [villagers, dispatch] = useReducer(reducer, []);

  const selectVillager = (villagerId: string) => {
    dispatch({ type: "SELECT", payload: villagerId });
  };

  const setVillagers = (villagers: VillagerEntity[]) => {
    dispatch({ type: "SET", payload: villagers });
  };

  const deselectAllVillagers = () => {
    dispatch({ type: "DESELECT_ALL", payload: null });
  };

  const trainVillager = (position: Position) => {
    const newVillager = createVillager(position);
    dispatch({ type: "ADD", payload: { position: position, villager: newVillager } });
  };

  const updateVillagers = (villagers: VillagerProps[]) => {
    dispatch({ type: "UPDATE", payload: villagers });
  };

  const setVillagerAction = (
    villager: VillagerProps,
    action: (
      villagers: VillagerProps[],
      villagerId: string,
      inventory: Inventory,
      buildings: BuildingProps[],
      mapObjects: MapObjectProps[],
      gameTickResult: GameTickResult
    ) => GameTickResult
  ) => {
    dispatch({ type: "SET_ACTION", payload: { villager, action } });
  };

  const value: VillagersContextProps = {
    villagers: villagers,
    selectVillager: selectVillager,
    setVillagers: setVillagers,
    deselectAllVillagers: deselectAllVillagers,
    trainVillager: trainVillager,
    setVillagerAction: setVillagerAction,
    updateVillagers: updateVillagers,
  };

  return <VillagersContext.Provider value={value}>{children}</VillagersContext.Provider>;
};

export default VillagersProvider;
