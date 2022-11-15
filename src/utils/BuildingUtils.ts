import { BuildingProps } from "../models/BuildingProps";
import { shapes } from '../config/Shapes';
import { resources } from '../config/Resources';
import { buildingOptions } from '../config/BuildingOptions';

import { Shape } from "../models/Shape";
import { v4 as uuidv4 } from 'uuid';
import { BuildingType } from "../models/enums/BuildingType";
import { BuildingOption } from "../models/BuildingOption";
import { trainVillager } from "./BuildingOptionsUtil";
import { Position } from "../models/Position";
import { Hitbox } from "../models/Hitbox";

function constructBuilding(position: { x: number, y: number }, shape: Shape, buildingOptions: BuildingOption[]) {
    let hitbox = createHitbox(position);
    let house: BuildingProps = {
        id: uuidv4(),
        selected: false,
        level: 1,
        name: shape.name,
        color: '#ffffff',
        icon: shape.icon,
        position: position,
        price: shape.price,
        size: shape.size,
        type: shape.type,
        image: shape.image,
        buildingOptions: buildingOptions,
        hitBox: hitbox
    }
    return house;
}

export function createBuilding(position: { x: number, y: number }, type: BuildingType) {
    let shape: Shape | undefined;
    switch (type) {
        case BuildingType.HOUSE:
            shape = shapes.find(x => x.type === BuildingType.HOUSE);
            if (!shape) return;
            return constructBuilding({...position, x: position.x - (50 / 2), y: position.y - (50 / 2)}, shape, []);
        case BuildingType.TENTS:
            shape = shapes.find(x => x.type === BuildingType.TENTS);
            if (!shape) return;
            return constructBuilding({...position, x: position.x - (50 / 2), y: position.y - (50 / 2)}, shape, []);
        case BuildingType.GUARD_TOWER:
            shape = shapes.find(x => x.type === BuildingType.GUARD_TOWER);
            if (!shape) return;
            return constructBuilding({...position, x: position.x - (50 / 2), y: position.y - (50 / 2)}, shape, []);
        case BuildingType.TOWN_CENTER:
            shape = shapes.find(x => x.type === BuildingType.TOWN_CENTER);
            if (!shape) return;
            return constructBuilding({...position, x: position.x - (50 / 2), y: position.y - (50 / 2)}, shape, [
                buildingOptions.find(x => x.name == 'Train Villager')!
            ]);
        default:
            return undefined;
    }
}


export function getStorageBuildings(buildings: BuildingProps[]) {
    return buildings.filter(x => x.type === BuildingType.STORAGE || x.type === BuildingType.TENTS || x.type === BuildingType.TOWN_CENTER);
}

function createHitbox(position: Position): Hitbox {
    return {
        leftTop: {
            x: position.x - 25,
            y: position.y - 25
        },
        rightBottom: {
            x: position.x + 25,
            y: position.y + 25
        }
    }
}

export function setSelectedBuilding(buildings: BuildingProps[], toSelectId: string) {
    let buildingsCopy = [...buildings];
    let selectedBuilding = buildingsCopy.find(x => x.id === toSelectId);
    if (selectedBuilding) {
        selectedBuilding.selected = true;
    }
    buildingsCopy.filter(x => x.id !== toSelectId).forEach(x => x.selected = false);
    return buildingsCopy;
}