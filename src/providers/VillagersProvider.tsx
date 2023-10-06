import { useReducer } from "react";
import Villager from "../components/Villager/Villager";
import { VillagersContext } from "../context/villagers/villagersContext";
import { VillagersContextProps } from "../context/villagers/villagersContextProps";
import { EntityElementType } from "../models/EntityElementType";
import { Position } from "../models/Position";
import { VillagerProps } from "../models/VillagerProps";
import { createVillager } from "../utils/BuildingOptionsUtil";

// Action types
type ActionType =
  | { type: "SELECT"; payload: string }
  | { type: "OVERWRITE"; payload: (position: Position) => EntityElementType[] }
  | { type: "SET"; payload: EntityElementType[] }
  | { type: "DESELECT"; payload: string }
  | { type: "DESELECT_ALL"; payload: null }
  | { type: "UPDATE"; payload: EntityElementType }
  | { type: "ADD"; payload: { villager: VillagerProps; position: Position } };

function reducer(state: EntityElementType[], action: ActionType): EntityElementType[] {
  switch (action.type) {
    case "SELECT":
      return state.map((villagerEntity) =>
        villagerEntity.component.props.id === action.payload ? { ...villagerEntity, selected: true } : villagerEntity
      );
    case "ADD":
      const newVillager: EntityElementType = {
        component: <Villager {...action.payload.villager} />,
        selected: true,
        updated: false,
      };
      return [...state.map((villagerEntity) => ({ ...villagerEntity, selected: false })), newVillager];
    case "OVERWRITE":
      return action.payload({ x: document.documentElement.clientHeight / 2, y: document.documentElement.clientHeight / 2 });
    case "DESELECT_ALL":
      return [...state.map((villagerEntity) => ({ ...villagerEntity, selected: false }))];
    case "SET":
      return action.payload;
    case "UPDATE":
      return [
        ...state.map((villagerEntity) => {
          if (villagerEntity.component.props.id === action.payload.component.props.id) {
            return action.payload;
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
  // const [villagers, setVillagers] = useState<VillagerProps[]>([]);
  const [villagers, dispatch] = useReducer(reducer, []);

  const selectVillager = (villagerId: string) => {
    dispatch({ type: "SELECT", payload: villagerId });
  };

  const setVillagers = (villagers: EntityElementType[]) => {
    dispatch({ type: "SET", payload: villagers });
  };

  const deselectAllVillagers = () => {
    dispatch({ type: "DESELECT_ALL", payload: null });
  };

  const updateVillager = (villagerEntity: EntityElementType) => {
    dispatch({ type: "UPDATE", payload: villagerEntity });
  };

  const moveVillager = (villagerId: string, position: Position) => {}; // figure out

  const trainVillager = (position: Position) => {
    const newVillager = createVillager(position);
    dispatch({ type: "ADD", payload: { position: position, villager: newVillager } });
  };

  const value: VillagersContextProps = {
    villagers: villagers,
    selectVillager: selectVillager,
    setVillagers: setVillagers,
    deselectAllVillagers: deselectAllVillagers,
    moveVillager: moveVillager,
    trainVillager: trainVillager,
    updateVillager: updateVillager,
  };

  return <VillagersContext.Provider value={value}>{children}</VillagersContext.Provider>;
};

export default VillagersProvider;
