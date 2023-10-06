import { BuildingsContext } from "../context/buildings/buildingsContext";
import { BuildingsContextProps } from "../context/buildings/buildingsContextProps";
import { BuildingProps } from "../models/BuildingProps";
import { Position } from "../models/Position";
import { useEffect, useState } from "react";
import { EntityElementType } from "../models/EntityElementType";
import { BuildingType } from "../models/enums/BuildingType";
import { shapes } from "../config/Shapes";
import { createBuilding } from "../utils/BuildingUtils";
import Building from "../components/Building/Building";

type Props = { children: any };

function setInitialBuildings(
  position: Position,
  onClick: (e: any, buildingId: string) => void,
  onRightClick: (buildingId: string) => void
): EntityElementType[] {
  let townCenter = shapes.find((x) => x.type === BuildingType.TOWN_CENTER);
  if (townCenter) {
    const townCenter = createBuilding({ x: position.x, y: position.y }, BuildingType.TOWN_CENTER);
    const initialBuildings = townCenter ? [townCenter] : [];
    const buildingElements = initialBuildings.map((buildingProps) => {
      return {
        component: (
          <Building {...buildingProps} onClick={(e) => onClick(e, buildingProps.id)} onRightClick={() => onRightClick(buildingProps.id)}></Building>
        ),
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

const BuildingsProvider = ({ children }: Props) => {
  const [buildings, setBuildings] = useState<EntityElementType[]>();

  const onBuildingClick = (event: any, buildingId: string) => {
    event.stopPropagation();
    setBuildings((prev) => {
      const result = prev?.map((building) => {
        if (building.component.props.id === buildingId) {
          return { ...building, selected: true };
        }
        return building;
      });
      return result;
    });
  };

  const onBuildingRightClick = (buildingId: string) => {
    console.log("right clicked building");
  };

  useEffect(() => {
    console.log("init buildingsprovider");
    console.log(buildings);
    if (!buildings || buildings?.length === 0) {
      setBuildings(
        setInitialBuildings(
          { x: document.documentElement.clientHeight / 2, y: document.documentElement.clientHeight / 2 },
          onBuildingClick,
          onBuildingRightClick
        )
      );
    }
  }, []);

  useEffect(() => {
    console.log("buildings in provider: ", buildings);
  }, [buildings]);

  const addBuilding = (building: BuildingProps, position: Position) => {
    console.log("adding building");
    setBuildings((previous) => {
      let toReturn = previous?.map((building) => {
        return { ...building, selected: false };
      });

      const newBuilding: EntityElementType = {
        component: (
          <Building {...building} onClick={(event) => onBuildingClick(event, building.id)} onRightClick={() => onBuildingRightClick(building.id)} />
        ),
        selected: true,
        updated: false,
      };
      toReturn?.push(newBuilding);
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
