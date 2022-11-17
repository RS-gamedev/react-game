import React, { useCallback, useEffect, useState } from 'react';
import styles from './Game.module.css';
import Settings from '../components/Settings/Settings';
import { Shape } from '../models/Shape';
import { BuildingProps } from '../models/BuildingProps';
import Building from '../components/Building/Building';
import { shapes } from '../config/Shapes';
import { createBuilding } from '../utils/BuildingUtils';
import Resources from '../components/Resources/Resources';
import { Inventory } from '../models/Inventory';
import useInterval from '../hooks/useInterval';
import { ObjectProps } from '../models/ObjectProps';
import MapObject from '../components/MapObject/MapObject';
import { VillagerProps } from '../models/VillagerProps';
import Villager from '../components/Villager/Villager';
import UpgradeMenu from '../components/UpgradeMenu/UpgradeMenu';
import { reduceResourcesFromInventory, canAfford } from '../utils/ResourceUtils';
import { setInitialBuildings, setInitialInventory, setInitialMapObjects } from '../utils/GameUtils';
import { VillagerType } from '../models/enums/VillagerType';
import { GameTickResult } from '../models/GameTickResult';
import { doMoveToLocation } from '../utils/MovementUtils';
import { doWoodcutting } from '../utils/villagerUtils/LumberjackUtils';
import { executeTasks } from '../utils/StatusUtils';

const Game = (map: any) => {
    const [villagers, setVillagers] = useState<VillagerProps[]>([]);
    const [buildings, setBuildings] = useState<BuildingProps[]>([]);
    const [mapObjects, setMapObjects] = useState<ObjectProps[]>([])
    const [allShapes, setAllShapes] = useState<Shape[]>(shapes);
    const [inventory, setInventory] = useState<Inventory>({ resources: [] });
    const [gameTick, setGameTick] = useState(0);

    useInterval(() => {
        // GAME LOOP
        setGameTick((prev) => prev + 1);
    }, 50);

    var selectedShape = allShapes.find(x => x.selected);
    var selectedBuilding = buildings.find(x => x.selected);
    var selectedVillager = villagers.find(x => x.selected);
    var selectedMapObject = mapObjects.find(x => x.selected);

    useEffect(() => {
        let result = executeTasks(villagers, inventory, mapObjects, buildings);
        if(result.buildings){
            console.log("setting buildings")
            setBuildings(result.buildings);
        }
        if(result.inventory){
            console.log("setting inventory")
            setInventory(result.inventory);
        }
        if(result.mapObjects){
            console.log("setting mapObjects")
            setMapObjects(result.mapObjects);
        }
        if(result.villagers){
            setVillagers(result.villagers);
        }
    }, [gameTick]);


    useEffect(() => {
        setInventory(setInitialInventory()!);
        setBuildings(setInitialBuildings()!);
        setMapObjects((prev) => setInitialMapObjects(map));
    }, [map]);

    function addBuilding(building?: BuildingProps) {
        if (!building) return;
        let buildingsCopy = [...buildings];
        let shapesCopy = [...shapes];
        buildingsCopy.push(building);
        buildingsCopy.forEach(x => x.selected = false);
        shapesCopy.forEach(x => x.selected = false);
        setAllShapes(shapesCopy);
        setBuildings(buildingsCopy);
    }

    const trainVillager = (villager: VillagerProps) => {
        let villagersCopy = [...villagers];
        villagersCopy.push(villager);
        setVillagers((prev) => villagersCopy);
    }

    const selectShape = useCallback((shape: Shape) => {
        let shapesCopy = [...allShapes];
        let selectedShape = shapesCopy.find(x => x.name == shape.name);
        if (selectedShape) {
            selectedShape.selected = !selectedShape?.selected;
        }
        shapesCopy.filter(x => x.id !== shape.id).forEach(x => x.selected = false);
        setAllShapes((prev) => shapesCopy);
    }, [allShapes]);

    // Deselect other, and select given
    const deselectAllBut = useCallback((event: any, toSelectId: string) => {
        event.stopPropagation();
        let mapObjectsCopy = [...mapObjects];
        mapObjectsCopy.forEach(x => x.selected = false);
        let toSelectMapObject = mapObjectsCopy.find(x => x.id === toSelectId);
        if (toSelectMapObject) {
            toSelectMapObject.selected = true;
        }
        setMapObjects((prev) => mapObjectsCopy);

        let villagersCopy = [...villagers];
        villagersCopy.forEach(x => x.selected = false);
        let toSelectVillager = villagersCopy.find(x => x.id === toSelectId);
        if (toSelectVillager) {
            toSelectVillager.selected = true;
            selectedVillager = toSelectVillager;
        }
        setVillagers(villagersCopy);

        let buildingsCopy = [...buildings];
        buildingsCopy.forEach(x => x.selected = false);
        let toSelectBuilding = buildingsCopy.find(x => x.id === toSelectId);
        if (toSelectBuilding) {
            toSelectBuilding.selected = true;
        }
        setBuildings(buildingsCopy);
    }, [buildings, villagers, mapObjects])

    // Left click handler
    function handleClick(event: any): any {
        if (!selectedShape || !canAfford(inventory?.resources, selectedShape?.price)) {
            let buildingsCopy = [...buildings];
            buildingsCopy.forEach(x => x.selected = false);
            setBuildings((prev) => buildingsCopy);

            let villagersCopy = [...villagers];
            villagersCopy.forEach(x => x.selected = false);
            setVillagers((prev) => villagersCopy);

            let mapObjectsCopy = [...mapObjects];
            mapObjectsCopy.forEach(x => x.selected = false);
            setMapObjects((prev) => mapObjectsCopy);
            return;
        };

        let building: BuildingProps | undefined = createBuilding({ x: event.clientX, y: event.clientY }, selectedShape?.type);
        if (building) {
            let result = reduceResourcesFromInventory(inventory!, building.price);
            if (result[1]) {
                setInventory((prev) => result[0]);
                addBuilding(building);
            }
        }
    }

    // Right click handler
    const handleRightClick = useCallback((event: any) => {
        event.preventDefault();
        if (selectedVillager) {
                selectedVillager.currentTask = (villagers: VillagerProps[], villagerId: string, inventory: Inventory, buildings: BuildingProps[], mapObjects: ObjectProps[]) => doMoveToLocation(villagers, selectedVillager!.id, { x: event.clientX, y: event.clientY })
        }
    }, [selectedVillager, villagers])

    const onTrain = (entity: any, type: VillagerType) => {
        if(type === VillagerType.VILLAGER){
            trainVillager(entity);
        }
        return entity;
    }

    function handleVillagerRightClick(){

    }

    const handleMapObjectRightClick = useCallback((event: any, mapObjectId: string) => {
        event.stopPropagation();
        event.preventDefault();
        let mapObject = mapObjects.find(object => object.id === mapObjectId);
        if(mapObject && selectedVillager){
            selectedVillager.currentTask = (villagers: VillagerProps[], villagerId: string, inventory: Inventory, buildings: BuildingProps[], mapObjects: ObjectProps[]) => doWoodcutting(villagers, villagerId, inventory, buildings, mapObjects, mapObject!);
        }
    }, [mapObjects, selectedVillager])

    const handleBuildingRightClick = useCallback((event: any) => {
    }, [selectedBuilding])


    return (
        <div className={styles.background} onClick={handleClick} onContextMenu={handleRightClick}>
            <div className={styles.actions} onClick={event => event.stopPropagation()}>
                <Settings onClick={selectShape} shapes={allShapes}></Settings>
                {(selectedBuilding) ? <UpgradeMenu inStock={undefined} onTrain={onTrain} selectedBuilding={selectedBuilding} selectedVillager={undefined} selectedMapObject={undefined}></UpgradeMenu> : <></>}
                {(selectedVillager) ? <UpgradeMenu inStock={selectedVillager.inventoryItems} onTrain={onTrain} selectedBuilding={undefined} selectedVillager={selectedVillager} selectedMapObject={undefined}></UpgradeMenu> : <></>}
                {(selectedMapObject) ? <UpgradeMenu inStock={selectedMapObject.inventory} onTrain={onTrain} selectedBuilding={undefined} selectedVillager={undefined} selectedMapObject={selectedMapObject}></UpgradeMenu> : <></>}

            </div>
            <div className={styles.resourceArea}>
                {(inventory) ? <Resources inventory={inventory}></Resources> : <></>}
            </div>

            {(buildings) ? buildings?.map((building, index) => {
                if (building) {
                    return <Building key={building.id} {...building} onClick={deselectAllBut} onRightClick={handleBuildingRightClick}></Building>
                }
            }) : <></>
            }
            {(mapObjects) ? mapObjects?.map((mapObject, index) => {
                if (mapObject) {
                    return <MapObject key={mapObject.id} {...mapObject} onClick={deselectAllBut} onRightClick={handleMapObjectRightClick}></MapObject>
                }
            }) : <></>
            }
            {(villagers) ? villagers?.map((villager, index) => {
                if (villager) {
                    return <Villager key={villager.id} {...villager} onClick={deselectAllBut}></Villager>
                }
            }) : <></>
            }

        </div>
    );
}
export default Game;