import { useReducer } from "react";
import Villager from "../components/Villager/Villager";
import { VillagersContext } from "../context/villagers/villagersContext";
import { VillagersContextProps } from "../context/villagers/villagersContextProps";
import { EntityElementType } from "../models/EntityElementType";
import { Position } from "../models/Position";
import { VillagerProps } from "../models/VillagerProps";

// Action types
type ActionType =
  | { type: "SELECT"; payload: string }
  | { type: "OVERWRITE"; payload: (position: Position) => EntityElementType[] }
  | { type: "DESELECT"; payload: string }
  | { type: "DESELECT_ALL"; payload: null }
  | { type: "ADD"; payload: { villager: VillagerProps; position: Position } };

function reducer(state: EntityElementType[], action: ActionType): EntityElementType[] {
  switch (action.type) {
    case "SELECT":
      return state.map((villager) => (villager.component.props.id === action.payload ? { ...villager, selected: true } : villager));
    case "ADD":
      const newBuilding: EntityElementType = {
        component: <Villager {...action.payload.villager} />,
        selected: true,
        updated: false,
      };
      return [...state.map((villager) => ({ ...villager, selected: false })), newBuilding];
    case "OVERWRITE":
      return action.payload({ x: document.documentElement.clientHeight / 2, y: document.documentElement.clientHeight / 2 });
    case "DESELECT_ALL":
      return [...state.map((villager) => ({ ...villager, selected: false }))];
    default:
      return state;
  }
}
type Props = { children: any };

const VillagersProvider = ({ children }: Props) => {
  // const [villagers, setVillagers] = useState<VillagerProps[]>([]);
  const [villagers, dispatch] = useReducer(reducer, []);

  const selectVillager = (villagerId: string) => {};

  const setVillagers = (villagers: VillagerProps[]) => {};

  const deselectAllVillagers = () => {};

  const moveVillager = (villagerId: string, position: Position) => {}; // figure out

  const trainVillager = (position: Position) => {};

  const value: VillagersContextProps = {
    villagers: villagers,
    selectVillager: selectVillager,
    setVillagers: setVillagers,
    deselectAllVillagers: deselectAllVillagers,
    moveVillager: moveVillager,
    trainVillager: trainVillager,
  };

  return <VillagersContext.Provider value={value}>{children}</VillagersContext.Provider>;
};

export default VillagersProvider;
