import { BuildingProps } from "../models/BuildingProps";
import { shapes } from '../config/Shapes';
import { resources } from '../config/Resources';
import { Price } from "../models/Price";
import { Shape } from "../models/Shape";
import { v4 as uuidv4 } from 'uuid';

function constructBuilding(position: { x: number, y: number }, price: Price[], shape: Shape) {
    let house: BuildingProps = {
        id: uuidv4(),
        color: '#ffffff',
        icon: shape.icon,
        position: position,
        price: price,
        size: {
            heigth: '50px',
            width: '50px'
        }
    }
    return house;
}

export function createBuilding(position: { x: number, y: number }, type: string) {
    let gems = resources.find(x => x.name === 'Gems');
    let coins = resources.find(x => x.name === 'Coins');
    let wood = resources.find(x => x.name === 'Wood');
    let shape: Shape | undefined;
    let price: Price[] = [];
    switch (type) {
        case "House":
            shape = shapes.find(x => x.name === 'House');
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
        case "Tents":
            shape = shapes.find(x => x.name === 'Tents');
            price = [{
                amount: 50,
                type: coins
            }];
            if (!shape) return;
            return constructBuilding(position, price, shape);
        case "Guard tower":
            shape = shapes.find(x => x.name === 'Guard tower');
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