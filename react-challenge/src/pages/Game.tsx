import { useEffect, useState } from 'react';
import styles from './Game.module.css';
import Button from '../components/Button/Button';
import Settings from '../components/Settings/Settings';
import { Shape } from '../models/Shape';
import { BuildingProps } from '../models/BuildingProps';
import Building from '../components/Building/Building';
import { shapes } from '../config/Shapes';
import { createBuilding, getStorageBuildings } from '../utils/BuildingUtils';
import Resources from '../components/Resources/Resources';
import { Inventory } from '../models/Inventory';
import { resources } from '../config/Resources';
import { canAfford } from '../utils/GameUtils';
import useInterval from '../hooks/useInterval';
import { ObjectProps } from '../models/ObjectProps';
import MapObject from '../components/MapObject/MapObject';
import { VillagerProps } from '../models/VillagerProps';
import Villager from '../components/Villager/Villager';
import { findNearestStorage, findNearestTree, getDistance, getNewPosition, moveVillagerToNearestRock, moveVillagerToPosition, reachedGoalPosition } from '../utils/MovementUtils';
import { Status } from '../models/enums/Status';
import { Position } from '../models/Position';
import { VillagerType } from '../models/enums/VillagerType';
import UpgradeMenu from '../components/UpgradeMenu/UpgradeMenu';
import { reduceResourcesFromInventory } from '../utils/ResourceUtils';
import { BuildingType } from '../models/enums/BuildingType';


type State = {
    mapObjects: ObjectProps[],
    buildings: BuildingProps[]
}
function Game(map: any) {
    const [villagers, setVillagers] = useState<VillagerProps[]>([]);
    const [buildings, setBuildings] = useState<BuildingProps[]>([]);
    const [mapObjects, setMapObjects] = useState<ObjectProps[]>([])
    const [allShapes, setAllShapes] = useState<Shape[]>(shapes);
    const [inventory, setInventory] = useState<Inventory>();
    var selectedShape = allShapes.find(x => x.selected);
    var selectedBuilding = buildings.find(x => x.selected);


    useInterval(() => {
        let idleVillagersCopy = [...villagers].filter(x => x.status === Status.IDLE);
        let otherVillagers = [...villagers].filter(x => x.status !== Status.IDLE);
        idleVillagersCopy = setNewTaskForIdleVillagers(idleVillagersCopy);
        setVillagers(idleVillagersCopy.concat(otherVillagers));

        // WALKING TO TREE VILLAGERS
        let walkingToTreeVillagers = [...villagers].filter(x => x.status === Status.WALKING_TO_TREE);
        let notWalkingToTreeVillagers = [...villagers].filter(x => x.status !== Status.WALKING_TO_TREE);
        walkingToTreeVillagers = walkingToTreeVillagers.map(villager => {
            if (villager.goalPosition) {
                let movedVillager = moveVillagerToPosition(villager, villager.goalPosition);
                if (movedVillager.goalPosition && reachedGoalPosition(movedVillager.position, movedVillager.goalPosition)) {
                    movedVillager.status = Status.IDLE;
                    return movedVillager;
                }
                return movedVillager;
            }
            return villager;
        });
        idleVillagersCopy = walkingToTreeVillagers.concat(notWalkingToTreeVillagers)

        // CUTTING TREE VILLAGERS
        let cuttingTreeVillagers = [...idleVillagersCopy].filter(x => x.status === Status.CUTTING_TREE);
        let notCuttingTreeVillagers = [...idleVillagersCopy].filter(x => x.status !== Status.CUTTING_TREE);
        cuttingTreeVillagers = cuttingTreeVillagers.map(villager => {
            if (villager.inventoryItems[0] && villager.inventoryItems[0].amount >= villager.inventorySlots) {
                villager.status = Status.IDLE;
                return villager;
            }
            let toAddResource = villager.inventoryItems.find(x => x.resource.name == 'Wood');
            if (toAddResource && toAddResource) {
                toAddResource.amount += 0.5;
            }
            else {
                villager.inventoryItems.push({ resource: resources.find(x => x.name == 'Wood')!, amount: 0.5 });
            }
            villager.status = Status.IDLE;
            return villager;
        });
        idleVillagersCopy = cuttingTreeVillagers.concat(notCuttingTreeVillagers);

        // RETURNING RESOURCES VILLAGERS
        let returningResourcesVillagers = [...idleVillagersCopy].filter(x => x.status === Status.RETURNING_RESOURCES);
        let notReturningResourcesVillagers = [...idleVillagersCopy].filter(x => x.status !== Status.RETURNING_RESOURCES);
        returningResourcesVillagers = returningResourcesVillagers.map(villager => {
            if (villager.goalPosition) {
                let movedVillager = moveVillagerToPosition(villager, villager.goalPosition);
                // console.log(reachedGoalPosition(movedVillager.position, movedVillager.goalPosition!));
                if (movedVillager.goalPosition && reachedGoalPosition(movedVillager.position, movedVillager.goalPosition)) {
                    // movedVillager.inventoryItems = [];
                    movedVillager.status = Status.IDLE;
                    return movedVillager;
                }
                return movedVillager;
            }
            return villager;
        });
        idleVillagersCopy = returningResourcesVillagers.concat(notReturningResourcesVillagers);

        // DROPPING RESOURCES IN STORAGE
        let droppingResourcesVillagers = [...idleVillagersCopy].filter(x => x.status === Status.DROPPING_RESOURCES);
        let notDroppingResourcesVillagers = [...idleVillagersCopy].filter(x => x.status !== Status.DROPPING_RESOURCES);
        droppingResourcesVillagers = droppingResourcesVillagers.map(villager => {
            let invCopy = { ...inventory! };
            villager.inventoryItems.forEach(invItem => {
                if (invCopy && invCopy.resources) {
                    let invCopyItemsCopy = [...invCopy.resources];
                    let inventoryResource = invCopyItemsCopy.find(x => x.resource.name == invItem.resource.name);
                    if (inventoryResource) {
                        inventoryResource.amount! += invItem.amount;
                        invItem.amount = 0;
                        invCopy.resources = invCopyItemsCopy;
                        setInventory((prev) => invCopy);
                        villager.status = Status.IDLE;
                    }
                }
            });
            return villager;
        });
        idleVillagersCopy = droppingResourcesVillagers.concat(notDroppingResourcesVillagers);

        // SAVE
        setVillagers(idleVillagersCopy);
    }, 100);

    function setNewTaskForIdleVillagers(villagers: VillagerProps[]) {
        villagers.forEach(villager => {
            switch (villager.type) {
                case VillagerType.LUMBERJACK:
                    let distanceToNearestTree = getDistance(villager.position, findNearestTree(villager.position, mapObjects.filter(x => x.name == 'tree')));
                    let distanceToNearestStorage = getDistance(villager.position, findNearestStorage(villager.position, getStorageBuildings(buildings)));
                    if (villager.goalPosition && distanceToNearestTree < 25) {
                        // Als dichtsbijzijnde boom binnen 25px weg is (staat erop)
                        if (villager.inventoryItems && villager.inventoryItems[0] && villager.inventoryItems[0].amount >= villager.inventorySlots) {
                            // En inventory is vol
                            villager.status = Status.RETURNING_RESOURCES;
                            villager.goalPosition = findNearestStorage(villager.position, getStorageBuildings(buildings));
                            // ga naar storage
                            return villagers;
                        }
                        else {
                            villager.status = Status.CUTTING_TREE;
                            return villager;
                        }
                        // villager staat op boom
                    }
                    else if (villager.goalPosition && distanceToNearestStorage < 25) {
                        // Staat op storage
                        if (villager.inventoryItems && villager.inventoryItems[0] && villager.inventoryItems[0].amount >= villager.inventorySlots) {
                            // En inventory is vol
                            villager.status = Status.DROPPING_RESOURCES;
                            villager.goalPosition = findNearestStorage(villager.position, getStorageBuildings(buildings));
                            // Drop resources
                            return villagers;
                        }
                        else {
                            villager.status = Status.WALKING_TO_TREE;
                            villager.goalPosition = findNearestTree(villager.position, mapObjects.filter(x => x.name == 'tree'));
                            return villagers;
                        }

                    }

                    else {
                        villager.status = Status.WALKING_TO_TREE;
                        villager.goalPosition = findNearestTree(villager.position, mapObjects.filter(x => x.name == 'tree'));
                        return villagers;
                    }
                case VillagerType.MINER:
                    return moveVillagerToNearestRock(villager);
                // Find nearest rock
                default:
                    return moveVillagerToNearestRock(villager);
            }
        });
        return villagers;
    }



    function moveVillager(villager: VillagerProps, goalPosition: Position) {
        let villagerCopy = { ...villager };
        villagerCopy.position = getNewPosition(villager.position, { x: goalPosition.x, y: goalPosition.y });
        return villagerCopy;
    }

    useEffect(() => {
        let wood = resources.find(x => x.name === 'Wood');
        let coins = resources.find(x => x.name === 'Coins');
        let gems = resources.find(x => x.name === 'Gems');
        if (!wood || !coins || !gems) return;
        let inventoryInit: Inventory = {
            resources: [
                {
                    resource: coins,
                    amount: 500
                },
                {
                    resource: wood,
                    amount: 200
                },
                {
                    resource: gems,
                    amount: 0
                }
            ]
        }
        setInventory(inventoryInit);
        let townCenter = shapes.find(x => x.type === BuildingType.TOWN_CENTER);
        if(townCenter){
            let initialBuildings: BuildingProps[] = [{id: "1", position: {x: 500, y:300}, color: '#ffffff', icon: townCenter.icon, level: 1, name: 'Town center', price: townCenter.price, type: townCenter.type, size: townCenter.size, selected: false}]
            setBuildings(initialBuildings);
        }
        else{
            setBuildings([]);
        }
        let initialMapObjects: ObjectProps[] = map.map.map((x: any) => { return { name: x.name, position: x.position } })

        setMapObjects(initialMapObjects);
        setVillagers([
            { id: '1', name: 'villager', position: { x: 300, y: 200 }, status: Status.IDLE, inventoryItems: [], inventorySlots: 10, type: VillagerType.LUMBERJACK },
            { id: '2', name: 'villager', position: { x: 700, y: 50 }, status: Status.IDLE, inventoryItems: [], inventorySlots: 10, type: VillagerType.LUMBERJACK }
        ]);
    }, []);

    function addBuilding(building?: BuildingProps) {
        if (!building) return;
        let buildingsCopy = [...buildings];
        let shapesCopy = [...shapes];
        buildingsCopy.push(building);
        buildingsCopy.forEach(x => x.selected = false);
        shapesCopy.forEach(x => x.selected = false);
        console.log(buildingsCopy);
        setBuildings(buildingsCopy)
    }

    function handleClick(event: any): any {
        if (!selectedShape || !canAfford(inventory?.resources, selectedShape?.price)) {
            let buildingsCopy = [...buildings];
            buildingsCopy.forEach(x => x.selected = false);
            setBuildings((prev) => buildingsCopy);
            return;
        };

        let building: BuildingProps | undefined = createBuilding({ x: event.clientX, y: event.clientY }, selectedShape?.type);
        if (building) {
            let result = reduceResourcesFromInventory(inventory!, building.price);
            if(result[1]){
                setInventory(result[0]);
                addBuilding(building);
            }
        }
    }

    function selectShape(shape: Shape) {
        let shapesCopy = [...allShapes];
        let selectedShape = shapesCopy.find(x => x.name == shape.name);
        if (selectedShape) {
            selectedShape.selected = !selectedShape?.selected;
        }
        shapesCopy.filter(x => x.id !== shape.id).forEach(x => x.selected = false);
        setAllShapes((prev) => shapesCopy);
    }

    function selectBuilding(event: any, building: BuildingProps) {
        event.preventDefault();
        event.stopPropagation();
        let buildingsCopy = [...buildings];
        let selectedBuilding = buildingsCopy.find(x => x.id === building.id);
        if (selectedBuilding) {
            selectedBuilding.selected = true;
        }
        buildingsCopy.filter(x => x.id !== building.id).forEach(x => x.selected = false);
        setBuildings(buildingsCopy);
        return building;
    }

    return (
        <div className={styles.background} onClick={handleClick}>
            <div className={styles.actions} onClick={event => event.stopPropagation()}>
                <Settings onClick={selectShape} shapes={allShapes}></Settings>
                {(selectedBuilding) ? <UpgradeMenu selectedBuilding={selectedBuilding}></UpgradeMenu> : <></> }
               
            </div>
            <div className={styles.resourceArea}>
                {(inventory) ? <Resources resources={inventory.resources}></Resources> : <></>}
            </div>

            {(buildings) ? buildings?.map((building, index) => {
                if (building) {
                    let _building = { ...building };
                    return <Building selected={building.selected} key={building.id} color={_building.color} position={_building.position} size={_building.size} icon={_building.icon} onClick={event => selectBuilding(event, building)}></Building>
                }
            }) : <></>
            }
            {(buildings) ? mapObjects?.map((mapObject, index) => {
                if (mapObject) {
                    return <MapObject key={mapObject.id} {...mapObject}></MapObject>
                }
            }) : <></>
            }
            {(villagers) ? villagers?.map((villager, index) => {
                if (villager) {
                    return <Villager key={villager.id} {...villager}></Villager>
                }
            }) : <></>
            }

        </div>
    );
}
export default Game;