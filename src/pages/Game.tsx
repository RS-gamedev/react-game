import { useCallback, useEffect, useState } from 'react';
import styles from './Game.module.css';
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
import UpgradeMenu from '../components/UpgradeMenu/UpgradeMenu';
import { reduceResourcesFromInventory } from '../utils/ResourceUtils';
import { BuildingType } from '../models/enums/BuildingType';
import { doWoodcutting, moveToLocation } from '../utils/StatusUtils';
import { findNearestTree, getDistance } from '../utils/MovementUtils';
import { v4 as uuidv4 } from 'uuid';


type State = {
    mapObjects: ObjectProps[],
    buildings: BuildingProps[]
}
function Game(map: any) {
    const [villagers, setVillagers] = useState<VillagerProps[]>([]);
    const [buildings, setBuildings] = useState<BuildingProps[]>([]);
    const [mapObjects, setMapObjects] = useState<ObjectProps[]>([])
    const [allShapes, setAllShapes] = useState<Shape[]>(shapes);
    const [inventory, setInventory] = useState<Inventory>({ resources: [] });
    var selectedShape = allShapes.find(x => x.selected);
    var selectedBuilding = buildings.find(x => x.selected);
    var selectedVillager = villagers.find(x => x.selected);
    var selectedMapObject = mapObjects.find(x => x.selected);

    useInterval(() => {
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
      console.log("mapobjects changed");
    
    }, [mapObjects])
    

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
        if (townCenter) {
            let initialBuildings: BuildingProps[] = [{ id: "1", position: { x: 500, y: 300 }, color: '#ffffff', icon: townCenter.icon, level: 1, name: 'Town center', price: townCenter.price, type: townCenter.type, size: townCenter.size, selected: false }]
            if (initialBuildings) {
                setBuildings(initialBuildings);
            }
        }
        else {
            setBuildings([]);
        }
        let initialMapObjects: ObjectProps[] = map.map.map((x: any) => { return { id: uuidv4(), name: x.name, position: x.position, selected: false } })
        setMapObjects(initialMapObjects);
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
                setInventory(result[0]);
                addBuilding(building);
            }
        }
    }

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

    const addVillager = useCallback((villager: VillagerProps) => {
        let villagersCopy = [...villagers];
        villagersCopy.push(villager);
        setVillagers(villagersCopy);
    }, [])

    const selectShape = useCallback((shape: Shape) => {
        let shapesCopy = [...allShapes];
        let selectedShape = shapesCopy.find(x => x.name == shape.name);
        if (selectedShape) {
            selectedShape.selected = !selectedShape?.selected;
        }
        shapesCopy.filter(x => x.id !== shape.id).forEach(x => x.selected = false);
        setAllShapes((prev) => shapesCopy);
    }, [shapes]);

    function selectBuilding(event: any, building: BuildingProps) {
        event.preventDefault();
        event.stopPropagation();
        let villagersCopy = [...villagers];
        villagersCopy.forEach(x => x.selected = false);
        setVillagers(villagersCopy);
        let buildingsCopy = [...buildings];
        let selectedBuilding = buildingsCopy.find(x => x.id === building.id);
        if (selectedBuilding) {
            selectedBuilding.selected = true;
        }
        buildingsCopy.filter(x => x.id !== building.id).forEach(x => x.selected = false);
        setBuildings(buildingsCopy);
        return building;
    }

    function selectVillager(event: any, villager: VillagerProps) {
        event.preventDefault();
        event.stopPropagation();
        let buildingsCopy = [...buildings];
        buildingsCopy.forEach(x => x.selected = false);
        setBuildings(buildingsCopy);

        let villagersCopy = [...villagers];
        let selectedVillager = villagersCopy.find(x => x.id === villager.id);
        if (selectedVillager) {
            selectedVillager.selected = true;
        }
        villagersCopy.filter(x => x.id !== villager.id).forEach(x => x.selected = false);
        setVillagers(villagersCopy);
        return villager;
    }

    function selectMapObject(event: any, mapObject: ObjectProps) {
        event.preventDefault();
        event.stopPropagation();
        let mapObjectsCopy = [...mapObjects];
        let selectedMapObject = mapObjectsCopy.find(x => x.id === mapObject.id);
        if (selectedMapObject) {
            selectedMapObject.selected = true;
        }
        mapObjectsCopy.filter(x => x.id !== mapObject.id).forEach(x => x.selected = false);
        setMapObjects(mapObjectsCopy);
        return mapObject;
    }


    const onMapObjectClick = useCallback((event: any, mapObjectId: string) => {
        let mapObject = mapObjects.find(x => x.id == mapObjectId);
        if(mapObject){
            console.log(mapObject);
            return selectMapObject(event, mapObject);
        }
    }, [mapObjects]);

    
    const onVillagerClick = useCallback((event: any, villagerId: string) => {
        let villager = villagers.find(x => x.id == villagerId);
        if(villager){
            console.log(villager);
            return selectVillager(event, villager);
        }
    }, [mapObjects]);

    const onBuildingClick = useCallback((event: any, buildingId: string) => {
        let building = buildings.find(x => x.id == buildingId);
        if(building){
            console.log(building);
            return selectBuilding(event, building);
        }
    }, [buildings]);
    

    return (
        <div className={styles.background} onClick={handleClick} onContextMenu={handleRightClick}>
            <div className={styles.actions} onClick={event => event.stopPropagation()}>
                <Settings onClick={selectShape} shapes={allShapes}></Settings>
                {(selectedBuilding) ? <UpgradeMenu onAddVillager={addVillager} selectedBuilding={selectedBuilding} selectedVillager={undefined}></UpgradeMenu> : <></>}
                {(selectedVillager) ? <UpgradeMenu onAddVillager={addVillager} selectedBuilding={undefined} selectedVillager={selectedVillager}></UpgradeMenu> : <></>}
            </div>
            <div className={styles.resourceArea}>
                {(inventory) ? <Resources resources={inventory.resources}></Resources> : <></>}
            </div>

            {(buildings) ? buildings?.map((building, index) => {
                if (building) {
                    return <Building  {...building} onClick={onBuildingClick}></Building>
                }
            }) : <></>
            }
            {(mapObjects) ? mapObjects?.map((mapObject, index) => {
                if (mapObject) {
                    return <MapObject key={mapObject.id} {...mapObject} onClick={onMapObjectClick}></MapObject>
                }
            }) : <></>
            }
            {(villagers) ? villagers?.map((villager, index) => {
                if (villager) {
                    return <Villager key={villager.id} {...villager} onClick={onVillagerClick}></Villager>
                }
            }) : <></>
            }

        </div>
    );
}
export default Game;