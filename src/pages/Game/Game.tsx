import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from "react";
import BuySection from "../../components/BuySection/BuySection";
import MapObject from "../../components/MapObject/MapObject";
import MapObjectArea from "../../components/MapObjectArea/MapObjectArea";
import PlacementOverlay from "../../components/PlacementOverlay/PlacementOverlay";
import Resources from "../../components/Resources/Resources";
import UpgradeMenu from "../../components/UpgradeMenu/UpgradeMenu";
import Villager from "../../components/Villager/Villager";
import { shapes } from "../../config/Shapes";
import { useBuildings } from "../../hooks/useBuildings";
import useInterval from "../../hooks/useInterval";
import { useInventory } from "../../hooks/useInventory";
import { useMapObjects } from "../../hooks/useMapObjects";
import { useVillagers } from "../../hooks/useVillagers";
import { BuildingProps } from "../../models/BuildingProps";
import { BuyOption } from "../../models/BuyOption";
import { Availability } from "../../models/enums/Availability";
import { Status } from "../../models/enums/Status";
import { PlacementOverlayConfig } from "../../models/PlacementOverlayConfig";
import { Position } from "../../models/Position";
import { Shape } from "../../models/Shape";
import { Size } from "../../models/Size";
import { VillagerProfession } from "../../models/VillagerProfession";
import { VillagerProps } from "../../models/VillagerProps";
import { useGame } from "../../providers/GameProvider";
import { createBuilding } from "../../utils/BuildingUtils";
import { reduceResourcesFromInventory } from "../../utils/ResourceUtils";
import { createVillagerAction } from "../../utils/StatusUtils";
import styles from "./Game.module.css";

const Game = () => {
  const { buildings, addBuilding, setBuildings, selectBuilding, deselectAllBuildings } = useBuildings();
  const { villagers, setVillagers, deselectAllVillagers, selectVillager, updateVillagers, trainVillager } = useVillagers();
  const { mapObjects, selectMapObject, deselectAllMapObjects } = useMapObjects();
  const { inventory, setInventory } = useInventory();

  const [allShapes, setAllShapes] = useState<Shape[]>(shapes.filter((x) => x.availability === Availability.GAME_LEVEL1));
  const [gameTick, setGameTick] = useState(0);
  const [placementOverlayConfig, setPlacementOverlayConfig] = useState<PlacementOverlayConfig | undefined>();
  const [gameSpeed, setGameSpeed] = useState(1);
  const settingsAreaWidth = "240px";

  useInterval(() => {
    // GAME LOOP
    setGameTick((prev) => prev + 1);
  }, 1000 / gameSpeed);

  var selectedShape = allShapes.find((shape) => shape.selected);
  var selectedBuilding = buildings.find((building) => building.building.selected);
  var selectedVillager = villagers.find((villager) => villager.selected);
  var selectedMapObject = mapObjects.find((mapObject) => mapObject.selected);

  const MMapObjects = useMemo(() => {
    return mapObjects;
  }, [mapObjects]);

  useEffect(() => {
    // const gameTickResult: GameTickResult = getVillagerActionsResult(
    //   [
    //     ...villagers.map((entity) => {
    //       return { ...entity };
    //     }),
    //   ],
    //   { ...inventory },
    //   mapObjects.map((x) => JSON.parse(JSON.stringify(x.mapObject))),
    //   buildings.map((x) => JSON.parse(JSON.stringify(x.building)))
    // );
    // updateVillagers(gameTickResult.villagers.filter((x) => x.updated).map((x) => x.villager));
  }, [gameTick]);

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
    console.log("adding villager");
    trainVillager({ x: 200, y: 300 });
    trainVillager({ x: 400, y: 500 });
  }, []);

  useEffect(() => {
    console.log("new villagers value");
  }, [villagers]);

  useEffect(() => {
    console.log("new mapObjects value");
  }, [mapObjects]);

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

  // Left click handler
  const handleClick = (event: any): any => {
    deselectAllBuildings();
    deselectAllMapObjects();
    deselectAllVillagers();
    setPlacementOverlayConfig(undefined);
    return;
  };

  // Right click handler
  const handleRightClick = useCallback(
    (event: any) => {
      event.preventDefault();
      let clientRect = event.currentTarget.getBoundingClientRect();
      let xPos = event.pageX - clientRect.left;
      let yPos = event.pageY - clientRect.top;
      if (selectedVillager) {
        console.log("villager selected");

        // setVillagerAction(
        //   selectedVillager,
        //   createVillagerAction({ type: VillagerActionType.MOVE_TO_POSITION, clickedPosition: { x: xPos, y: yPos } })
        //   // (_villagers: VillagerProps[], _villagerId: string, _inventory: Inventory, _buildings: BuildingProps[], _mapObjects: MapObjectProps[]) =>
        //   //   doMoveToLocation(_villagers, _villagerId, _inventory, _buildings, _mapObjects,)
        // );
      }
    },
    [selectedVillager]
  );
  const setVillagerCurrentAction = (villager: VillagerProps, additionalParams: any) => {
    villager.currentAction = createVillagerAction(additionalParams);
  };

  const handleMapObjectRightClick = useCallback((event: any, mapObjectId: string) => {
    // event.preventDefault();
    // event.stopPropagation();
    // if (selectedVillager) {
    //   setVillagerAction(
    //     selectedVillager.villager,
    //     (_villagers: VillagerEntity[], _villagerId: string, _inventory: Inventory, _buildings: BuildingEntity[], _mapObjects: MapObjectEntity[]) =>
    //       doGatheringTask(_villagers, selectedVillager?.villager.id || "", _inventory, _buildings, _mapObjects, false, mapObjectId, mapObjectId)
    //   );
    // }
  }, []);

  // function handleVillagerRightClick() {}

  // const handleMapObjectRightClick = useCallback(
  //   (event: any, mapObjectId: string) => {
  //     event.stopPropagation();
  //     event.preventDefault();
  //     let targetObject = mapObjects.find((x) => x.component.props.id === mapObjectId);
  //     if (
  //       selectedVillager &&
  //       targetObject?.component.props.name === "tree" &&
  //       selectedVillager.component.props.professions.find((x: VillagerProfession) => x.active)?.profession.name === "Lumberjack"
  //     ) {
  //       selectedVillager.component.props.currentTask = (
  //         villagers: VillagerProps[],
  //         villagerId: string,
  //         inventoryItems: InventoryItem[],
  //         buildings: EntityElementType[],
  //         mapObjects: EntityElementType[]
  //       ) => doGatheringTask(villagers, villagerId, inventoryItems, buildings, mapObjects, false, "tree", mapObjectId);
  //     }
  //     if (
  //       selectedVillager &&
  //       targetObject?.component.props.name === "rock" &&
  //       selectedVillager.component.props.professions.find((x: VillagerProfession) => x.active)?.profession.name === "Miner"
  //     ) {
  //       selectedVillager.component.props.currentTask = (
  //         villagers: VillagerProps[],
  //         villagerId: string,
  //         inventoryItems: InventoryItem[],
  //         buildings: EntityElementType[],
  //         mapObjects: EntityElementType[]
  //       ) => doGatheringTask(villagers, villagerId, inventoryItems, buildings, mapObjects, false, "stone", mapObjectId);
  //     }
  //     // selectedVillager && updateVillager(selectedVillager);
  //   },
  //   [mapObjects, selectedVillager]
  // );

  // const handleBuildingRightClick = useCallback(
  //   (event: any, buildingId: string) => {
  //     event.stopPropagation();
  //     event.preventDefault();
  //     let clickedBuilding = buildings.find((x) => x.component.props.id === buildingId);
  //     if (
  //       selectedVillager &&
  //       clickedBuilding?.component.props.name === "Farm field" &&
  //       selectedVillager.component.props.professions.find((x: VillagerProfession) => x.active)?.profession.name === "Farmer"
  //     ) {
  //       selectedVillager.component.props.currentTask = (
  //         villagers: VillagerProps[],
  //         villagerId: string,
  //         inventoryItems: InventoryItem[],
  //         buildings: EntityElementType[],
  //         mapObjects: EntityElementType[]
  //       ) => doGatheringTask(villagers, villagerId, inventoryItems, buildings, mapObjects, true, "Farm field", buildingId);
  //     }
  //   },
  //   [buildings, selectedVillager]
  // );

  const handleChangeProfessionClick = useCallback((newVillagerProfessions: VillagerProfession[], villagerId: string) => {
    // const newVillagers = villagers.map((vill) => {
    //   if (vill.id === villagerId) {
    //     vill = { ...vill, professions: newVillagerProfessions };
    //   }
    //   return vill;
    // });
    // setVillagers(newVillagers);
  }, []);

  const handleOpenOverlay = (buildingOption: BuyOption, centerPosition: Position) => {
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
        setInventory(result[0]);
        addBuilding(building, { x: xPos, y: yPos });
      }
    }
  };

  const deselectAll = () => {
    deselectAllBuildings();
    deselectAllMapObjects();
    deselectAllVillagers();
  };

  const handleSelectMapObject = useCallback((e: SyntheticEvent, mapObjectId: string) => {
    deselectAll();
    selectMapObject(mapObjectId);
    e.stopPropagation();
  }, []);

  const handleSelectBuilding = useCallback((e: SyntheticEvent, buildingId: string) => {
    deselectAll();
    selectBuilding(buildingId);
    e.stopPropagation();
  }, []);

  const handleSelectVillager = useCallback((e: SyntheticEvent, villagerId: string) => {
    // deselectAll();
    // selectVillager(villagerId);
    // e.stopPropagation();
  }, []);

  const handleBuildingRightClick = useCallback((e: any) => {}, []);
  const handleRightClickVIllager = useCallback(() => {}, []);

  return (
    <div className={styles.background}>
      <div className={styles.actionsArea}>
        <div className={styles.actions}>
          <BuySection onClick={selectShape} shapes={allShapes} width={settingsAreaWidth} />

          {selectedBuilding ? (
            <UpgradeMenu
              key={selectedBuilding.component.props.id}
              inStock={selectedBuilding.component.props.inventory}
              // onPlaceBuilding={handleOpenOverlay}
              buyOptions={selectedBuilding.component.props.buyOptions}
              status={Status.NONE}
              name={selectedBuilding.component.props.name}
              entityId={selectedBuilding.component.props.id}
              selectedEntityHitbox={selectedBuilding.component.props.hitBox}
              height={"50%"}
            ></UpgradeMenu>
          ) : (
            <></>
          )}
          {selectedVillager ? (
            <UpgradeMenu
              key={selectedVillager.id}
              // onProfessionChange={handleChangeProfessionClick}
              villagerProfessions={selectedVillager.professions}
              inStock={selectedVillager.inventoryItems}
              buyOptions={selectedVillager.buyOptions}
              status={Status.NONE}
              height={"50%"}
              name={selectedVillager.name}
              entityId={selectedVillager.id}
              selectedEntityHitbox={selectedVillager.hitBox}
            ></UpgradeMenu>
          ) : (
            <></>
          )}
          {selectedMapObject ? (
            <UpgradeMenu
              key={selectedMapObject.id}
              inStock={selectedMapObject.inventory}
              buyOptions={selectedMapObject.buyOptions}
              status={Status.NONE}
              height={"50%"}
              name={selectedMapObject.name}
              entityId={selectedMapObject.id}
              selectedEntityHitbox={selectedMapObject.hitBox}
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
        style={{ width: document.documentElement.clientHeight - 50, height: document.documentElement.clientHeight - 50 }}
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
        <div className={styles.resourceArea}>{inventory ? <Resources></Resources> : <></>}</div>

        {/* {buildings.map((building) => {
          return (
            <EntityWrapper
              entityId={building.building.id}
              onClick={handleSelectBuilding}
              onRightClick={handleBuildingRightClick}
              hitBox={building.building.hitBox}
              size={building.building.size}
              selected={building.building.selected}
            >
              {building.component}
            </EntityWrapper>
          );
        })} */}
        <MapObjectArea mapObjects={MMapObjects} />

        {villagers?.map((villager) => {
          return (
            <Villager
              key={villager.id}
              id={villager.id}
              name={villager.name}
              hitBox={villager.hitBox}
              size={villager.size}
              professions={villager.professions}
              selected={villager.selected}
            />
          );
        })}
      </div>
    </div>
  );
};
export default Game;
