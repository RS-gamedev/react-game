import { BuildingsContext } from "../context/buildings/buildingsContext";
import { BuildingsContextProps } from "../context/buildings/buildingsContextProps";
import { BuildingProps } from "../models/BuildingProps";
import { Position } from "../models/Position";
import { useState } from "react";
import { BuildingElementType } from "../models/Building";
import { BuildingType } from "../models/enums/BuildingType";
import { shapes } from "../config/Shapes";
import { createBuilding } from "../utils/BuildingUtils";
import Building from "../components/Building/Building";

type Props = { children: any };

function setInitialBuildings(position: Position): BuildingElementType[] {
  let townCenter = shapes.find((x) => x.type === BuildingType.TOWN_CENTER);
  if (townCenter) {
    const townCenter = createBuilding({ x: position.x, y: position.y }, BuildingType.TOWN_CENTER);
    const initialBuildings = townCenter ? [townCenter] : [];
    const buildingElements = initialBuildings.map((buildingProps) => {
      return { component: <Building {...buildingProps} onClick={() => {}} onRightClick={() => {}}></Building>, selected: false, updated: false};
    });
    if (buildingElements) {
      return buildingElements;
    }
  }
  return [];
}

const BuildingsProvider = ({ children }: Props) => {
  const [buildings, setBuildings] = useState<BuildingElementType[]>(
    setInitialBuildings({ x: document.documentElement.clientHeight / 2, y: document.documentElement.clientHeight / 2 })
  );

  const addBuilding = (building: BuildingProps, position: Position) => {
    // console.log("adding building");
    // setBuildings((previous) => {
    //   let toReturn = previous.map((building) => {
    //     return { ...building, selected: false };
    //   });
    //   toReturn.push(building);
    //   return toReturn;
    // });
  };

  const value: BuildingsContextProps = {
    buildings: buildings || [],
    addBuilding: addBuilding,
    setBuildings: setBuildings,
  };

  return <BuildingsContext.Provider value={value}>{children}</BuildingsContext.Provider>;
};

export default BuildingsProvider;
