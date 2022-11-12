import { useEffect, useState } from 'react';
import styles from './Game.module.css';
import Button from '../components/Button/Button';
import Settings from '../components/Settings/Settings';
import { Shape } from '../models/Shape';
import { BuildingProps } from '../models/BuildingProps';
import Building from '../components/Building/Building';
import { shapes } from '../config/Shapes';
import { createBuilding } from '../utils/BuildingUtils';
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


type State = {
    mapObjects: ObjectProps[],
    buildings: BuildingProps[]
}
function Game(map: any) {
    const [history, setHistory] = useState<State[]>([]);
    const [villagers, setVillagers] = useState<VillagerProps[]>([]);
    const [currentStateIndex, setCurrentStateIndex] = useState<number>(0);
    const [allShapes, setAllShapes] = useState<Shape[]>(shapes);
    const [inventory, setInventory] = useState<Inventory>();

    var currentState = history[currentStateIndex - 1];
    var selectedShape = allShapes.find(x => x.selected);
    var canRedo = history[history.length - 1]?.buildings.length < history[history.length - 2]?.buildings.length;
    var canUndo = currentState?.buildings?.length > 0;


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
            let invCopy = {...inventory!};
            villager.inventoryItems.forEach(invItem => {
                if(invCopy && invCopy.resources){
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
        // executeActions();
    }, 100);

    // function moveVillagerToPosition(villager: VillagerProps, statusAfter){

    // }


    useEffect(() => {
    }, [villagers])


    function setNewTaskForIdleVillagers(villagers: VillagerProps[]) {
        // let villagersCopy = [...villagers];
        // let newIdles = idleVillagers.map(villager => villager.position = getNewPosition(villager.position, goalPosition) 
        villagers.forEach(villager => {
            switch (villager.type) {
                case VillagerType.LUMBERJACK:
                    let distanceToNearestTree = getDistance(villager.position, findNearestTree(villager.position, currentState.mapObjects.filter(x => x.name == 'tree')));
                    let distanceToNearestStorage = getDistance(villager.position, findNearestStorage(villager.position, currentState.buildings.filter(x => x.name == 'House')));
                    if (villager.goalPosition && distanceToNearestTree < 25) {
                        // Als dichtsbijzijnde boom binnen 25px weg is (staat erop)
                        if (villager.inventoryItems && villager.inventoryItems[0] && villager.inventoryItems[0].amount >= villager.inventorySlots) {
                            // En inventory is vol
                            villager.status = Status.RETURNING_RESOURCES;
                            villager.goalPosition = findNearestStorage(villager.position, currentState.buildings.filter(x => x.name == 'House'));
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
                            villager.goalPosition = findNearestStorage(villager.position, currentState.buildings.filter(x => x.name == 'House'));
                            // Drop resources
                            return villagers;
                        }
                        else {
                            villager.status = Status.WALKING_TO_TREE;
                            villager.goalPosition = findNearestTree(villager.position, currentState.mapObjects.filter(x => x.name == 'tree'));
                            return villagers;
                        }

                    }

                    else {
                        villager.status = Status.WALKING_TO_TREE;
                        console.log("Walking to trees last resort");
                        villager.goalPosition = findNearestTree(villager.position, currentState.mapObjects.filter(x => x.name == 'tree'));
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
        // moveVillagers(idleVillagers, otherVillagers);
    }



    function moveVillager(villager: VillagerProps, goalPosition: Position) {
        let villagerCopy = { ...villager };
        villagerCopy.position = getNewPosition(villager.position, { x: goalPosition.x, y: goalPosition.y });
        return villagerCopy;
    }

    // function moveVillagers(idleVillagers: VillagerProps[], otherVillagers: VillagerProps[]) {
    //     idleVillagersCopy = idleVillagersCopy.map((x: any) => moveVillager(x));
    //     setVillagers(idleVillagersCopy.concat(restVillagers));
    // }

    function findGoal(villager: VillagerProps) {
        if (villager) {

        }
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
        let initState: State = {
            buildings: [],
            mapObjects: map.map.map((x: any) => { return { name: x.name, position: x.position } })
        }
        let newHistory = [...history];
        newHistory.push(initState);
        setHistory(newHistory);
        setCurrentStateIndex(prev => prev + 1);
        setVillagers([
            { id: '1', name: 'villager', position: { x: 300, y: 200 }, status: Status.IDLE, inventoryItems: [], inventorySlots: 10, type: VillagerType.LUMBERJACK },
            { id: '2', name: 'villager', position: { x: 700, y: 50 }, status: Status.IDLE, inventoryItems: [], inventorySlots: 10, type: VillagerType.LUMBERJACK }
        ]);
    }, []);

    useEffect(() => {
    }, [history])

    function undo() {
        if (currentState.buildings.length == 0) return;
        addBuilding(false);
        setCurrentStateIndex(prev => prev + 1);
    }

    function redo() {
        let historyCopy = history.slice();
        if (historyCopy[historyCopy.length - 1].buildings.length > historyCopy[historyCopy.length - 2].buildings.length) return;
        setHistory(historyCopy.slice(0, -1));
        setCurrentStateIndex(prev => prev - 1);
    }

    function addBuilding(addBuilding: boolean, building?: BuildingProps) {
        let historyCopy = history.slice();
        let copyOfCurrent = { ...historyCopy[currentStateIndex - 1] };
        copyOfCurrent.buildings = (copyOfCurrent.buildings) ? [...copyOfCurrent.buildings] : [];
        copyOfCurrent.mapObjects = (copyOfCurrent.mapObjects) ? [...copyOfCurrent.mapObjects] : [];
        if (addBuilding) {
            // Add Building
            if (historyCopy.length > 0) {
                copyOfCurrent.buildings.push(building!);
                historyCopy.push(copyOfCurrent);
            }
            else {
                let newState: State = {
                    mapObjects: copyOfCurrent.mapObjects,
                    buildings: [building!]
                }
                historyCopy.push(newState);
            }
            setHistory(historyCopy);
        }
        else {
            // remove building
            copyOfCurrent.buildings = copyOfCurrent.buildings.slice(0, -1);
            historyCopy.push(copyOfCurrent);
            setHistory(historyCopy);
        }
    }
    function handleClick(event: any): any {
        if (!selectedShape || !canAfford(inventory?.resources, selectedShape?.price)) return;
        let building: BuildingProps | undefined = createBuilding({ x: event.clientX, y: event.clientY }, selectedShape?.name);
        if (building) {
            addBuilding(true, building);
        }
        setCurrentStateIndex(prev => prev + 1);
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

    return (
        <div className={styles.background} onClick={handleClick}>
            <div className={styles.actions}>
                <div className={styles.buttons}>
                    <Button text='Undo' disabled={!canUndo} onClick={undo} active={false} width="100%" height='45px'></Button>
                    <Button text='Redo' disabled={!canRedo} onClick={redo} active={false} width="100%" height='45px'></Button>
                </div>
                <Settings onClick={selectShape} shapes={allShapes} ></Settings>
            </div>
            <div className={styles.resourceArea}>
                {(inventory) ? <Resources resources={inventory.resources}></Resources> : <></>}
            </div>

            {(currentState) ? currentState?.buildings?.map((building, index) => {
                if (building) {
                    return <Building key={building.id} {...building}></Building>
                }
            }) : <></>
            }
            {(currentState) ? currentState?.mapObjects?.map((mapObject, index) => {
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