import { BuildingProps } from "../models/BuildingProps";
import { shapes } from '../config/Shapes';
import { resources } from '../config/Resources';
import { Price } from "../models/Price";
import { Shape } from "../models/Shape";
import { v4 as uuidv4 } from 'uuid';
import { BuildingType } from "../models/enums/BuildingType";

function constructBuilding(position: { x: number, y: number }, price: Price[], shape: Shape) {
    let house: BuildingProps = {
        id: uuidv4(),
        selected: false,
        level: 1,
        name: shape.name,
        color: '#ffffff',
        icon: shape.icon,
        position: position,
        price: price,
        size: {
            height: '3em',
            width: '3em',
        },
        type: shape.type
    }
    return house;
}

export function createBuilding(position: { x: number, y: number }, type: BuildingType) {
    let gems = resources.find(x => x.name === 'Gems');
    let coins = resources.find(x => x.name === 'Coins');
    let wood = resources.find(x => x.name === 'Wood');
    let shape: Shape | undefined;
    let price: Price[] = [];
    switch (type) {
        case BuildingType.HOUSE:
            shape = shapes.find(x => x.type === BuildingType.HOUSE);
            price = [{
                amount: 200,
                type: wood
            },
            {
                amount: 150,
                type: coins
            }];
            if (!shape) return;
            return constructBuilding(position, price, shape);
        case BuildingType.TENTS:
            shape = shapes.find(x => x.type === BuildingType.TENTS);
            price = [{
                amount: 50,
                type: coins
            }];
            if (!shape) return;
            return constructBuilding(position, price, shape);
        case BuildingType.GUARD_TOWER:
            shape = shapes.find(x => x.type === BuildingType.GUARD_TOWER);
            price = [{
                amount: 150,
                type: gems
            }];
            if (!shape) return;
            return constructBuilding(position, price, shape);
            case BuildingType.TOWN_CENTER:
                shape = shapes.find(x => x.type === BuildingType.TOWN_CENTER);
                price = [{
                    amount: 150,
                    type: gems
                }];
                if (!shape) return;
                return constructBuilding(position, price, shape);
        default:
            return undefined;
    }
}


export function getStorageBuildings(buildings: BuildingProps[]) {
    console.log(buildings);
    return buildings.filter(x => x.type === BuildingType.STORAGE || x.type === BuildingType.TENTS || x.type === BuildingType.TOWN_CENTER);
}