import { Shape } from "../models/Shape";
import { resources } from "./Resources";
import { v4 as uuidv4 } from 'uuid';

export const shapes: Shape[] = [
    {
        id: uuidv4(),
        name: "House",
        icon: ['fas', 'house'],
        iconColor: '#373c50',
        image: "",
        selected: true,
        price: [
            { type: resources.find(x => x.name === "Wood"), amount: 100 }
        ],
         
    },
    {
        id: uuidv4(),
        name: "Tents",
        icon: ['fas', 'tents'],
        iconColor: '#373c50',
        image: "",
        selected: false,
        price: [
            { type: resources.find(x => x.name === "Coins"), amount: 50 }
        ]
    },
    {
        id: uuidv4(),
        name: "Guard tower",
        icon: ['fas', 'tower-observation'],
        iconColor: '#373c50',
        image: "",
        selected: false,
        price: [
            { type: resources.find(x => x.name === "Gems"), amount: 150 }
        ]
    }
]