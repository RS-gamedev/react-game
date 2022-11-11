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
import { v4 as uuidv4 } from 'uuid';
import MapObject from '../components/MapObject/MapObject';
import { VillagerProps } from '../models/VillagerProps';
import Villager from '../components/Villager/Villager';
import { getNewPosition } from '../utils/MovementUtils';

type Item = {
    x: string,
    y: string
}

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
        moveVillagers();
    }, 200);

    function moveVillagers(){
        let villagersCopy = [...villagers];
        villagersCopy = villagersCopy.map((x) => ({ ...x, position: getNewPosition(x.position, {x: 800, y: 800})}));
        setVillagers(villagersCopy);
    }


    useEffect(() => {
        console.log(currentState);
    }, [currentState]);


    useEffect(() => {
        console.log("Loaded game");
        console.log(map);
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
        setVillagers([{ id: '1', name: 'villager', position: { x: 300, y: 200 } }]);
    }, []);

    function moveVillager(){

    }


    useEffect(() => {
        console.log(history);
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
        shapesCopy.forEach(x => {
            x.selected = false;
        });
        let selectedShape = allShapes.find(x => x.name == shape.name);
        if (selectedShape) selectedShape.selected = true;
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
            {(villagers) ? villagers?.map((mapObject, index) => {
                if (mapObject) {
                    return <Villager key={mapObject.id} {...mapObject}></Villager>
                }
            }) : <></>
            }

        </div>
    );
}
export default Game;