import { useEffect, useReducer } from "react";
import Building from "../components/Building/Building";
import { shapes } from "../config/Shapes";
import { BuildingsContext } from "../context/buildings/buildingsContext";
import { BuildingsContextProps } from "../context/buildings/buildingsContextProps";
import { BuildingEntity } from "../models/BuildingEntity";
import { BuildingProps } from "../models/BuildingProps";
import { BuildingType } from "../models/enums/BuildingType";
import { Position } from "../models/Position";
import { createBuilding } from "../utils/BuildingUtils";

type Props = { children: any };

const createBuildingEntity = (building: BuildingProps): BuildingEntity => {
  return {
    component: <Building {...building} />,
    building: building,
  };
};

function setInitialBuildings(position: Position): BuildingEntity[] {
  let townCenter = shapes.find((x) => x.type === BuildingType.TOWN_CENTER);
  if (townCenter) {
    const townCenter = createBuilding({ x: position.x, y: position.y }, BuildingType.TOWN_CENTER);
    const initialBuildings = townCenter ? [townCenter] : [];
    const buildingElements: BuildingEntity[] = initialBuildings.map((buildingProps) => {
      return {
        component: <Building {...buildingProps}></Building>,
        building: buildingProps,
      };
    });
    if (buildingElements) {
      return buildingElements;
    }
  }
  return [];
}

// Action types
type ActionType =
  | { type: "SELECT"; payload: string }
  | { type: "OVERWRITE"; payload: (position: Position) => BuildingEntity[] }
  | { type: "DESELECT"; payload: string }
  | { type: "DESELECT_ALL"; payload: null }
  | { type: "ADD"; payload: { building: BuildingProps; position: Position } };

// Reducer function
function buildingsReducer(state: BuildingEntity[], action: ActionType): BuildingEntity[] {
  switch (action.type) {
    case "SELECT":
      return [
        ...state.map((buildingEntity) => {
          if (buildingEntity.building.id === action.payload) {
            return createBuildingEntity({ ...buildingEntity.building, selected: true });
          }
          return buildingEntity;
        }),
      ];
    case "ADD":
      const newBuildingEntity = createBuildingEntity(action.payload.building);
      return [...state.map((building) => ({ ...building, selected: false })), newBuildingEntity];
    case "OVERWRITE":
      return action.payload({ x: document.documentElement.clientHeight / 2, y: document.documentElement.clientHeight / 2 });
    case "DESELECT_ALL":
      if (state.find((building) => building.building.selected)) {
        return [
          ...state.map((buildingEntity) => {
            if (buildingEntity.building.selected) {
              return createBuildingEntity({ ...buildingEntity.building, selected: false });
            }
            return buildingEntity;
          }),
        ];
      }
      return state;
    default:
      return state;
  }
}

const BuildingsProvider = ({ children }: Props) => {
  const [buildings, dispatch] = useReducer(buildingsReducer, []);

  // Event handler to add a new building
  const addBuilding = (building: BuildingProps, position: Position) => {
    dispatch({ type: "ADD", payload: { building, position } });
  };

  // Event handler to select a building
  const selectBuilding = (buildingId: string) => {
    dispatch({ type: "SELECT", payload: buildingId });
  };

  const deselectAllBuildings = () => {
    dispatch({ type: "DESELECT_ALL", payload: null });
  };

  useEffect(() => {
    dispatch({ type: "OVERWRITE", payload: setInitialBuildings });
  }, []);

  const value: BuildingsContextProps = {
    buildings: buildings || [],
    addBuilding,
    setBuildings: (newBuildings) => {},
    selectBuilding: selectBuilding,
    deselectAllBuildings: deselectAllBuildings,
  };

  return <BuildingsContext.Provider value={value}>{children}</BuildingsContext.Provider>;
};

export default BuildingsProvider;
