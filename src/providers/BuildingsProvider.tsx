import { BuildingsContext } from "../context/buildings/buildingsContext";
import { BuildingsContextProps } from "../context/buildings/buildingsContextProps";
import { BuildingProps } from "../models/BuildingProps";
import { Position } from "../models/Position";
import { useState } from "react";
import { setInitialBuildings } from "../utils/GameUtils";

type Props = { children: any, mapSize: {width: number, height: number} };

const BuildingsProvider = ({ children, mapSize }: Props) => {
  const [buildings, setBuildings] = useState<BuildingProps[]>(setInitialBuildings({ x: mapSize.height / 2, y: mapSize.height / 2 }));

  const addBuilding = (building: BuildingProps, position: Position) => {
    console.log("adding building");
    setBuildings((previous) => {
      let toReturn = previous.map((building) => {
        return { ...building, selected: false };
      });
      toReturn.push(building);
      return toReturn;
    });
  };

  const value: BuildingsContextProps = {
    buildings: buildings || [],
    addBuilding: addBuilding,
    setBuildings: setBuildings,
  };

  return <BuildingsContext.Provider value={value}>{children}</BuildingsContext.Provider>;
};

export default BuildingsProvider;
