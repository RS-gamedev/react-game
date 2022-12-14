import { useCallback, useEffect, useState } from "react";
import styles from "./Game.module.css";
import Settings from "../../components/Settings/Settings";
import { Shape } from "../../models/Shape";
import { BuildingProps } from "../../models/BuildingProps";
import Building from "../../components/Building/Building";
import { shapes } from "../../config/Shapes";
import { createBuilding } from "../../utils/BuildingUtils";
import Resources from "../../components/Resources/Resources";
import { Inventory } from "../../models/Inventory";
import useInterval from "../../hooks/useInterval";
import { ObjectProps } from "../../models/ObjectProps";
import MapObject from "../../components/MapObject/MapObject";
import { VillagerProps } from "../../models/VillagerProps";
import Villager from "../../components/Villager/Villager";
import UpgradeMenu from "../../components/UpgradeMenu/UpgradeMenu";
import { reduceResourcesFromInventory, canAfford } from "../../utils/ResourceUtils";
import { setInitialBuildings, setInitialInventory } from "../../utils/GameUtils";
import { doMoveToLocation } from "../../utils/MovementUtils";
import { executeTasks } from "../../utils/StatusUtils";
import { InventoryItem } from "../../models/InventoryItem";
import PlacementOverlay from "../../components/PlacementOverlay/PlacementOverlay";
import { BuildingOption } from "../../models/BuildingOption";
import { PlacementOverlayConfig } from "../../models/PlacementOverlayConfig";
import { Size } from "../../models/Size";
import { Position } from "../../models/Position";
import { Availability } from "../../models/enums/Availability";
import { doGatheringTask } from "../../utils/villagerUtils/VillagerTaskUtils";
import { Status } from "../../models/enums/Status";
import { VillagerProfession } from "../../models/VillagerProfession";
type props = {
  initialMapObjects: ObjectProps[];
  mapSize: Size;
};

const Game = ({ initialMapObjects, mapSize }: props) => {
  const [villagers, setVillagers] = useState<VillagerProps[]>([]);
  const [buildings, setBuildings] = useState<BuildingProps[]>([]);
  const [mapObjects, setMapObjects] = useState<ObjectProps[]>(initialMapObjects);
  const [allShapes, setAllShapes] = useState<Shape[]>(shapes.filter((x) => x.availability === Availability.GAME_LEVEL1));
  const [inventory, setInventory] = useState<Inventory>({ resources: [] });
  const [gameTick, setGameTick] = useState(0);
  const [placementOverlayConfig, setPlacementOverlayConfig] = useState<PlacementOverlayConfig | undefined>();
  const [gameSpeed, setGameSpeed] = useState(1);

  const settingsAreaWidth = "240px";

  useInterval(() => {
    // GAME LOOP
    setGameTick((prev) => prev + 1);
  }, 50 / gameSpeed);

  var selectedShape = allShapes.find((x) => x.selected);
  var selectedBuilding = buildings.find((x) => x.selected);
  var selectedVillager = villagers.find((x) => x.selected);
  var selectedMapObject = mapObjects.find((x) => x.selected);

  useEffect(() => {
    let result = executeTasks(villagers, inventory.resources, mapObjects, buildings);
    if (result.buildings) {
      setBuildings(result.buildings);
    }
    if (result.inventoryItems) {
      setInventory((prev) => {
        return { ...prev, resources: result.inventoryItems! };
      });
    }
    if (result.mapObjects) {
      setMapObjects(result.mapObjects);
    }
    if (result.villagers) {
      setVillagers(result.villagers);
    }
  }, [gameTick]);

  useEffect(() => {
    setInventory(setInitialInventory()!);
    setBuildings(setInitialBuildings({ x: mapSize.height / 2, y: mapSize.height / 2 })!);
  }, [initialMapObjects]);

  function addBuilding(building?: BuildingProps) {
    if (!building) return;
    setBuildings((previous) => {
      let toReturn = previous.map((building) => {
        return { ...building, selected: false };
      });
      toReturn.push(building);
      return toReturn;
    });
    setAllShapes((prev) => {
      return prev.map((x) => {
        return { ...x, selected: false };
      });
    });
  }

  const trainVillager = useCallback((villager: VillagerProps) => {
    setVillagers((prev) => {
      let toReturn = [...prev];
      toReturn.push(villager);
      return toReturn;
    });
  }, []);

  const selectShape = useCallback((shapeId: string) => {
    setAllShapes((prev) => {
      return prev.map((x) => {
        if (x.id === shapeId) {
          return { ...x, selected: !x.selected ? true : false };
        }
        return { ...x, selected: false };
      });
    });
  }, []);

  useEffect(() => {
    let _selectedShape = allShapes.find((x) => x.selected);
    if (!_selectedShape) {
      setPlacementOverlayConfig((prev) => {
        return { ...prev, show: false };
      });
    } else {
      setPlacementOverlayConfig((prev) => {
        return { ...prev, show: true, fullscreen: true, selectedShape: _selectedShape };
      });
    }
  }, [allShapes]);

  // Deselect other, and select given
  const deselectAllBut = useCallback((event: any, toSelectId: string) => {
    event.stopPropagation();
    setMapObjects((previous) => {
      return previous.map((mapObject) => {
        if (mapObject.id === toSelectId) return { ...mapObject, selected: true };
        return { ...mapObject, selected: false };
      });
    });
    setVillagers((previous) => {
      return previous.map((villager) => {
        if (villager.id === toSelectId) return { ...villager, selected: true };
        return { ...villager, selected: false };
      });
    });
    setBuildings((previous) => {
      return previous.map((building) => {
        if (building.id === toSelectId) return { ...building, selected: true };
        return { ...building, selected: false };
      });
    });
    setAllShapes((prev) => {
      return prev.map((x) => {
        return { ...x, selected: false };
      });
    });
  }, []);

  // Left click handler
  function handleClick(event: any): any {
    if (!selectedShape || !canAfford(inventory?.resources, selectedShape.price)) {
      setBuildings((prev) => {
        return prev.map((x) => {
          return { ...x, selected: false };
        });
      });
      setVillagers((prev) => {
        return prev.map((villager) => {
          return { ...villager, selected: false };
        });
      });
      setMapObjects((prev) => {
        return prev.map((mapObject) => {
          return { ...mapObject, selected: false };
        });
      });
      setAllShapes((prev) => {
        return prev.map((x) => {
          return { ...x, selected: false };
        });
      });
      setPlacementOverlayConfig(undefined);
      return;
    }
  }

  // Right click handler
  const handleRightClick = useCallback(
    (event: any) => {
      event.preventDefault();
      let clientRect = event.currentTarget.getBoundingClientRect();
      let xPos = event.pageX - clientRect.left;
      let yPos = event.pageY - clientRect.top;
      if (selectedVillager) {
        selectedVillager.currentTask = (
          villagers: VillagerProps[],
          villagerId: string,
          inventoryItems: InventoryItem[],
          buildings: BuildingProps[],
          mapObjects: ObjectProps[]
        ) => doMoveToLocation(villagers, villagerId, inventoryItems, buildings, mapObjects, { x: xPos, y: yPos });
      }
    },
    [selectedVillager]
  );

  const onTrain = useCallback(
    (entity: any) => {
      let result = reduceResourcesFromInventory(inventory, entity.price);
      if (result[1]) {
        setInventory(result[0]);
        trainVillager(entity);
      }
      return entity;
    },
    [inventory, trainVillager]
  );

  function handleVillagerRightClick() {}

  const handleMapObjectRightClick = useCallback(
    (event: any, mapObjectId: string) => {
      event.stopPropagation();
      event.preventDefault();
      let targetObject = mapObjects.find((x) => x.id === mapObjectId);
      if (selectedVillager && targetObject?.name === "tree" && selectedVillager.professions.find((x) => x.active)?.profession.name === "Lumberjack") {
        selectedVillager.currentTask = (
          villagers: VillagerProps[],
          villagerId: string,
          inventoryItems: InventoryItem[],
          buildings: BuildingProps[],
          mapObjects: ObjectProps[]
        ) => doGatheringTask(villagers, villagerId, inventoryItems, buildings, mapObjects, false, "tree", mapObjectId);
      }
      if (selectedVillager && targetObject?.name === "rock" && selectedVillager.professions.find((x) => x.active)?.profession.name === "Miner") {
        selectedVillager.currentTask = (
          villagers: VillagerProps[],
          villagerId: string,
          inventoryItems: InventoryItem[],
          buildings: BuildingProps[],
          mapObjects: ObjectProps[]
        ) => doGatheringTask(villagers, villagerId, inventoryItems, buildings, mapObjects, false, "stone", mapObjectId);
      }
    },
    [mapObjects, selectedVillager]
  );

  const handleBuildingRightClick = useCallback((event: any, buildingId: string) => {
    event.stopPropagation();
    event.preventDefault();
    let clickedBuilding = buildings.find((x) => x.id === buildingId);
    if (selectedVillager && clickedBuilding?.name === "Farm field" && selectedVillager.professions.find(x => x.active)?.profession.name === "Farmer") {
      selectedVillager.currentTask = (
        villagers: VillagerProps[],
        villagerId: string,
        inventoryItems: InventoryItem[],
        buildings: BuildingProps[],
        mapObjects: ObjectProps[]
      ) => doGatheringTask(villagers, villagerId, inventoryItems, buildings, mapObjects, true, "Farm field", buildingId);
    }
  }, [buildings, selectedVillager]);

  const handleChangeProfessionClick = useCallback((newVillagerProfessions: VillagerProfession[], villagerId: string) => {
    setVillagers((prev) => {
      return prev.map((vill) => {
        if (vill.id === villagerId) {
          vill = {...vill, professions: newVillagerProfessions}
        };
        return vill;
      });
    });
  }, []);

  const handleOpenOverlay = (buildingOption: BuildingOption, centerPosition: Position) => {
    let toPlaceShape = shapes.find((x) => x.id === buildingOption.shapeId);
    if (!toPlaceShape) return;
    let overlayConfig: PlacementOverlayConfig = {
      circle: true,
      fullscreen: false,
      show: true,
      size: getIncreasedSizeByRange(toPlaceShape.size, buildingOption.placementRange),
      centerPosition: centerPosition,
      selectedShape: toPlaceShape,
    };
    setPlacementOverlayConfig(overlayConfig);
  };

  function getIncreasedSizeByRange(size: Size, range?: number): Size {
    let toReturn = { ...size };
    toReturn.width += (range ? range : 0) * 2;
    toReturn.height += (range ? range : 0) * 2;
    return toReturn;
  }

  const handlePlaceBuilding = (event: any) => {
    let clientRect = event.target.parentElement.getBoundingClientRect();
    let xPos = event.pageX - clientRect.left;
    let yPos = event.pageY - clientRect.top;
    if (!placementOverlayConfig || !placementOverlayConfig.selectedShape) return;
    let building: BuildingProps | undefined = createBuilding({ x: xPos, y: yPos }, placementOverlayConfig?.selectedShape.type);
    if (building) {
      let result = reduceResourcesFromInventory(inventory!, building.price);
      if (result[1]) {
        setInventory((prev) => result[0]);
        addBuilding(building);
      }
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.actionsArea}>
        <div className={styles.actions} onClick={(event) => event.stopPropagation()}>
          <Settings onClick={selectShape} shapes={allShapes} width={settingsAreaWidth}></Settings>
          {selectedBuilding ? (
            <UpgradeMenu
              inStock={selectedBuilding.inventory}
              onTrain={onTrain}
              onPlaceBuilding={handleOpenOverlay}
              buildingOptions={selectedBuilding.buildingOptions}
              status={Status.NONE}
              children={{}}
              name={selectedBuilding.name}
              objectId={selectedBuilding.id}
              objectHitbox={selectedBuilding.hitBox}
              height={"50%"}
            ></UpgradeMenu>
          ) : (
            <></>
          )}
          {selectedVillager ? (
            <UpgradeMenu
              onProfessionChange={handleChangeProfessionClick}
              villagerProfessions={selectedVillager.professions}
              inStock={selectedVillager.inventoryItems}
              buildingOptions={selectedVillager.buildingOptions}
              status={Status.NONE}
              height={"50%"}
              children={{}}
              name={selectedVillager.name}
              objectId={selectedVillager.id}
              objectHitbox={selectedVillager.hitBox}
            ></UpgradeMenu>
          ) : (
            <></>
          )}
         {selectedMapObject ? (
            <UpgradeMenu
              inStock={selectedMapObject.inventory}
              buildingOptions={selectedMapObject.buildingOptions}
              status={Status.NONE}
              height={"50%"}
              children={{}}
              name={selectedMapObject.name}
              objectId={selectedMapObject.id}
              objectHitbox={selectedMapObject.hitBox}
            ></UpgradeMenu>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div
        className={styles.gameArea}
        onClick={handleClick}
        onContextMenu={handleRightClick}
        style={{ width: mapSize.height - 50, height: mapSize.height - 50 }}
      >
        {placementOverlayConfig?.show && (
          <PlacementOverlay
            onClick={handlePlaceBuilding}
            fullscreen={placementOverlayConfig?.fullscreen}
            circle={placementOverlayConfig.circle}
            size={placementOverlayConfig.size}
            centerPosition={placementOverlayConfig.centerPosition}
          />
        )}
        <div className={styles.resourceArea}>{inventory ? <Resources inventory={inventory} itemsHeight={50}></Resources> : <></>}</div>

        {buildings ? (
          buildings?.map((building, index) => {
            return building ? (
              <Building key={building.id} {...building} onClick={deselectAllBut} onRightClick={handleBuildingRightClick}></Building>
            ) : (
              <></>
            );
          })
        ) : (
          <></>
        )}
        {mapObjects ? (
          mapObjects?.map((mapObject, index) => {
            return mapObject ? (
              <MapObject key={mapObject.id} {...mapObject} onClick={deselectAllBut} onRightClick={handleMapObjectRightClick}></MapObject>
            ) : (
              <></>
            );
          })
        ) : (
          <></>
        )}
        {villagers ? (
          villagers?.map((villager, index) => {
            return villager ? <Villager key={villager.id} {...villager} onClick={deselectAllBut}></Villager> : <></>;
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
export default Game;
