import { BuildingsContext } from "../context/buildings/buildingsContext";
import { BuildingsContextProps } from "../context/buildings/buildingsContextProps";
import { BuildingProps } from "../models/BuildingProps";
import { Position } from "../models/Position";
import { useEffect, useReducer, useState } from "react";
import { EntityElementType } from "../models/EntityElementType";
import { BuildingType } from "../models/enums/BuildingType";
import { shapes } from "../config/Shapes";
import { createBuilding } from "../utils/BuildingUtils";
import Building from "../components/Building/Building";

type Props = { children: any };

function setInitialBuildings(
  position: Position
  // onClick: (e: any, buildingId: string) => void,
  // onRightClick: (buildingId: string) => void
): EntityElementType[] {
  let townCenter = shapes.find((x) => x.type === BuildingType.TOWN_CENTER);
  if (townCenter) {
    const townCenter = createBuilding({ x: position.x, y: position.y }, BuildingType.TOWN_CENTER);
    const initialBuildings = townCenter ? [townCenter] : [];
    const buildingElements = initialBuildings.map((buildingProps) => {
      return {
        component: <Building {...buildingProps}></Building>,
        selected: false,
        updated: false,
      };
    });
    if (buildingElements) {
      console.log("Setting initial buildings");
      return buildingElements;
    }
  }
  return [];
}

// Action types
type ActionType =
  | { type: "SELECT_BUILDING"; payload: string }
  | { type: "INIT_BUILDINGS"; payload: (position: Position) => EntityElementType[] }
  | { type: "DESELECT_BUILDING"; payload: string }
  | { type: "DESELECT_ALL"; payload: null }
  | { type: "ADD_BUILDING"; payload: { building: BuildingProps; position: Position } };

// Reducer function
function buildingsReducer(state: EntityElementType[], action: ActionType): EntityElementType[] {
  switch (action.type) {
    case "SELECT_BUILDING":
      return state.map((building) => (building.component.props.id === action.payload ? { ...building, selected: true } : building));
    case "ADD_BUILDING":
      const newBuilding: EntityElementType = {
        component: <Building {...action.payload.building} />,
        selected: true,
        updated: false,
      };
      return [...state.map((building) => ({ ...building, selected: false })), newBuilding];
    case "INIT_BUILDINGS":
      return action.payload({ x: document.documentElement.clientHeight / 2, y: document.documentElement.clientHeight / 2 });
    case "DESELECT_ALL":
      return [...state.map((building) => ({ ...building, selected: false }))];
    default:
      return state;
  }
}

const BuildingsProvider = ({ children }: Props) => {
  const [buildings, dispatch] = useReducer(buildingsReducer, []);
  // Event handler to add a new building
  const addBuilding = (building: BuildingProps, position: Position) => {
    dispatch({ type: "ADD_BUILDING", payload: { building, position } });
  };

  // Event handler to select a building
  const selectBuilding = (buildingId: string) => {
    console.log("selecting building");
    dispatch({ type: "SELECT_BUILDING", payload: buildingId });
  };

  const deselectAll = () => {
    dispatch({ type: "DESELECT_ALL", payload: null });
  };

  useEffect(() => {
    console.log("init buildingsprovider");
    console.log(buildings);
    dispatch({ type: "INIT_BUILDINGS", payload: setInitialBuildings });
  }, []);

  useEffect(() => {
    console.log("buildings in provider: ", buildings);
  }, [buildings]);

  const value: BuildingsContextProps = {
    buildings: buildings || [],
    addBuilding,
    setBuildings: (newBuildings) => {},
    selectBuilding: selectBuilding,
    deselectAll: deselectAll,
  };

  return <BuildingsContext.Provider value={value}>{children}</BuildingsContext.Provider>;
};

export default BuildingsProvider;
