import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Game.module.css';
import Settings from '../components/Settings/Settings';
import { Shape } from '../models/Shape';
import { BuildingProps } from '../models/BuildingProps';
import Building from '../components/Building/Building';
import { shapes } from '../config/Shapes';
import { createBuilding, setSelectedBuilding } from '../utils/BuildingUtils';
import Resources from '../components/Resources/Resources';
import { Inventory } from '../models/Inventory';
import useInterval from '../hooks/useInterval';
import { ObjectProps } from '../models/ObjectProps';
import MapObject from '../components/MapObject/MapObject';
import { VillagerProps } from '../models/VillagerProps';
import Villager from '../components/Villager/Villager';
import UpgradeMenu from '../components/UpgradeMenu/UpgradeMenu';
import { reduceResourcesFromInventory, canAfford } from '../utils/ResourceUtils';
import { doWoodcutting, moveToLocation } from '../utils/StatusUtils';
import { findNearestTree, getDistance } from '../utils/MovementUtils';
import { setInitialBuildings, setInitialInventory, setInitialMapObjects } from '../utils/GameUtils';
import { VillagerType } from '../models/enums/VillagerType';

const Game = (map: any) => {
    const [villagers, setVillagers] = useState<VillagerProps[]>([]);
    const [buildings, setBuildings] = useState<BuildingProps[]>([]);
    const [mapObjects, setMapObjects] = useState<ObjectProps[]>([])
    const [allShapes, setAllShapes] = useState<Shape[]>(shapes);
    const [inventory, setInventory] = useState<Inventory>({ resources: [] });
    var selectedShape = allShapes.find(x => x.selected);
    var selectedBuilding = buildings.find(x => x.selected);
    var selectedVillager = villagers.find(x => x.selected);
    var selectedMapObject = mapObjects.find(x => x.selected);

    useEffect(() => {
        console.log(buildings);
    },[buildings] )

    useInterval(() => {
        // GAME LOOP
        let newVillagers: VillagerProps[] | undefined = [...villagers];
        newVillagers = newVillagers.map(villager => {
            if (villager.currentTask !== undefined) {
                return villager.currentTask(villager, inventory, buildings, mapObjects);
            }
            return villager;
        });
        // SAVE
        setVillagers((prev) => newVillagers!);
    }, 50);

    useEffect(() => {
        setInventory(setInitialInventory()!);
        setBuildings(setInitialBuildings()!);
        setMapObjects(setInitialMapObjects(map)!);
    }, [map]);

    function addBuilding(building?: BuildingProps) {
        if (!building) return;
        let buildingsCopy = [...buildings];
        let shapesCopy = [...shapes];
        buildingsCopy.push(building);
        buildingsCopy.forEach(x => x.selected = false);
        shapesCopy.forEach(x => x.selected = false);
        setAllShapes(shapesCopy);
        setBuildings(buildingsCopy)
    }

    const addVillager = useCallback((villager: VillagerProps) => {
        let villagersCopy = [...villagers];
        villagersCopy.push(villager);
        setVillagers(villagersCopy);
    }, [villagers.length])

    const selectShape = useCallback((shape: Shape) => {
        let shapesCopy = [...allShapes];
        let selectedShape = shapesCopy.find(x => x.name == shape.name);
        if (selectedShape) {
            selectedShape.selected = !selectedShape?.selected;
        }
        shapesCopy.filter(x => x.id !== shape.id).forEach(x => x.selected = false);
        setAllShapes((prev) => shapesCopy);
    }, [shapes]);

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
        }
        setVillagers(villagersCopy);

        let buildingsCopy = [...buildings];
        buildingsCopy.forEach(x => x.selected = false);
        let toSelectBuilding = buildingsCopy.find(x => x.id === toSelectId);
        if (toSelectBuilding) {
            toSelectBuilding.selected = true;
        }
        setBuildings(buildingsCopy);
    }, [buildings.length, villagers.length, mapObjects.length])

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
                console.log(result);
                setInventory(result[0]);
                addBuilding(building);
            }
        }
    }

    // Right click handler
    function handleRightClick(event: any) {
        let villagersCopy = [...villagers];
        let _selectedVillager = villagersCopy.find(x => x.selected);
        event.preventDefault();
        if (_selectedVillager) {
            if (getDistance({ x: event.clientX, y: event.clientY }, findNearestTree({ x: event.clientX, y: event.clientY }, mapObjects.filter(x => x.name === 'tree'))) < 25) {
                _selectedVillager.currentTask = (villager: VillagerProps, inventory: Inventory, buildings: BuildingProps[], mapObjects: ObjectProps[]) => doWoodcutting(villager, inventory, buildings, mapObjects);
            }
            else {
                _selectedVillager.currentTask = (villager: VillagerProps) => moveToLocation(villager, { x: event.clientX, y: event.clientY })
            }
        }
        setVillagers(villagersCopy);
    }

    function onTrain(entity: any, type: VillagerType){
        addVillager(entity);
        console.log(entity);
        return entity
    }


    return (
        <div className={styles.background} onClick={handleClick} onContextMenu={handleRightClick}>
            <div className={styles.actions} onClick={event => event.stopPropagation()}>
                <Settings onClick={selectShape} shapes={allShapes}></Settings>
                {(selectedBuilding) ? <UpgradeMenu onTrain={onTrain}  selectedBuilding={selectedBuilding} selectedVillager={undefined} selectedMapObject={undefined}></UpgradeMenu> : <></>}
                {(selectedVillager) ? <UpgradeMenu onTrain={onTrain}  selectedBuilding={undefined} selectedVillager={selectedVillager} selectedMapObject={undefined}></UpgradeMenu> : <></>}
                {(selectedMapObject) ? <UpgradeMenu onTrain={onTrain} selectedBuilding={undefined} selectedVillager={undefined} selectedMapObject={selectedMapObject}></UpgradeMenu> : <></>}

            </div>
            <div className={styles.resourceArea}>
                {(inventory) ? <Resources resources={inventory.resources}></Resources> : <></>}
            </div>

            {(buildings) ? buildings?.map((building, index) => {
                if (building) {
                    return <Building  {...building} onClick={deselectAllBut}></Building>
                }
            }) : <></>
            }
            {(mapObjects) ? mapObjects?.map((mapObject, index) => {
                if (mapObject) {
                    return <MapObject key={mapObject.id} {...mapObject} onClick={deselectAllBut}></MapObject>
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