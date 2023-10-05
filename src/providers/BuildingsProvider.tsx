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

function setInitialBuildings(
  position: Position,
  onClick: (buildingId: string) => void,
  onRightClick: (buildingId: string) => void
): BuildingElementType[] {
  let townCenter = shapes.find((x) => x.type === BuildingType.TOWN_CENTER);
  if (townCenter) {
    const townCenter = createBuilding({ x: position.x, y: position.y }, BuildingType.TOWN_CENTER);
    const initialBuildings = townCenter ? [townCenter] : [];
    const buildingElements = initialBuildings.map((buildingProps) => {
      return {
        component: (
          <Building {...buildingProps} onClick={() => onClick(buildingProps.id)} onRightClick={() => onRightClick(buildingProps.id)}></Building>
        ),
        selected: false,
        updated: false,
      };
    });
    if (buildingElements) {
      return buildingElements;
    }
  }
  return [];
}

const BuildingsProvider = ({ children }: Props) => {
  const onBuildingClick = (buildingId: string) => {
    setBuildings((prev) => {
      return prev.map((building) => {
        if (building.component.props.id === buildingId) {
          return { ...building, selected: true };
        }
        return building;
      });
    });
  };

  const onBuildingRightClick = (buildingId: string) => {
    console.log("right clicked building");
  };

  const [buildings, setBuildings] = useState<BuildingElementType[]>(
    setInitialBuildings(
      { x: document.documentElement.clientHeight / 2, y: document.documentElement.clientHeight / 2 },
      onBuildingClick,
      onBuildingRightClick
    )
  );

  const addBuilding = (building: BuildingProps, position: Position) => {
    console.log("adding building");
    setBuildings((previous) => {
      let toReturn = previous.map((building) => {
        return { ...building, selected: false };
      });

      const newBuilding: BuildingElementType = {
        component: <Building {...building} onClick={() => onBuildingClick(building.id)} onRightClick={() => onBuildingRightClick(building.id)} />,
        selected: true,
        updated: false,
      };
      toReturn.push(newBuilding);
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
