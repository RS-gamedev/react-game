import { useReducer } from "react";
import Villager from "../components/Villager/Villager";
import { VillagersContext } from "../context/villagers/villagersContext";
import { VillagersContextProps } from "../context/villagers/villagersContextProps";
import { EntityElementType } from "../models/EntityElementType";
import { Inventory } from "../models/Inventory";
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
  | { type: "UPDATE"; payload: VillagerEntity }
  | { type: "ADD"; payload: { villager: VillagerProps; position: Position } }
  | {
      type: "PERFORM_ACTIONS";
      payload: { villagers: VillagerEntity[]; inventory: Inventory; buildings: EntityElementType[]; mapObjects: EntityElementType[] };
    }
  | { type: "SET_ACTION"; payload: { villager: VillagerProps; action: Function } };

function reducer(state: VillagerEntity[], action: ActionType): VillagerEntity[] {
  switch (action.type) {
    case "SELECT":
      return [
        ...state.map((villagerEntity) => {
          if(villagerEntity.villager.id === action.payload){
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
      return [
        ...state.map((villagerEntity) => {
          if (villagerEntity.villager.id === action.payload.component["props"].id) {
            return action.payload;
          }
          return villagerEntity;
        }),
      ];
    case "PERFORM_ACTIONS":
      return [
        ...state.map((villagerEntity) => {
          if (!villagerEntity.villager.currentAction) return villagerEntity;
          let updatedVillagerProps: VillagerProps = villagerEntity.villager.currentAction(
            action.payload.villagers,
            villagerEntity.villager.id,
            action.payload.inventory,
            action.payload.buildings,
            action.payload.mapObjects
          );
          return createVillagerEntity(updatedVillagerProps);
        }),
      ];
    case "SET_ACTION":
      return [
        ...state.map((villagerEntity) => {
          if (villagerEntity.villager.id === action.payload.villager.id) {
            const updatedVillagerProps = { ...villagerEntity.villager, currentAction: action.payload.action };
            return createVillagerEntity(updatedVillagerProps);
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

  const updateVillager = (villagerEntity: VillagerEntity) => {
    dispatch({ type: "UPDATE", payload: villagerEntity });
  };

  const moveVillager = (villagerId: string, position: Position) => {}; // figure out

  const trainVillager = (position: Position) => {
    const newVillager = createVillager(position);
    dispatch({ type: "ADD", payload: { position: position, villager: newVillager } });
  };

  const performVillagerActions = (
    villagers: VillagerEntity[],
    inventory: Inventory,
    buildings: EntityElementType[],
    mapObjects: EntityElementType[]
  ) => {
    dispatch({ type: "PERFORM_ACTIONS", payload: { villagers, inventory, buildings, mapObjects } });
  };

  const setVillagerAction = (villager: VillagerProps, action: Function) => {
    dispatch({ type: "SET_ACTION", payload: { villager, action } });
  };

  const value: VillagersContextProps = {
    villagers: villagers,
    selectVillager: selectVillager,
    setVillagers: setVillagers,
    deselectAllVillagers: deselectAllVillagers,
    moveVillager: moveVillager,
    trainVillager: trainVillager,
    updateVillager: updateVillager,
    performVillagerActions: performVillagerActions,
    setVillagerAction: setVillagerAction,
  };

  return <VillagersContext.Provider value={value}>{children}</VillagersContext.Provider>;
};

export default VillagersProvider;
