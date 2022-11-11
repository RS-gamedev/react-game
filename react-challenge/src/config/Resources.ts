import { Resource } from "../models/Resource";
import { v4 as uuidv4 } from 'uuid';

export const resources: Resource[] = [
    {
        id: uuidv4(),
        name: "Wood",
        icon: ['fas', 'tree'],
        color: '#589d53'
    },
    {
        id: uuidv4(),
        name: "Coins",
        icon: ['fas', 'coins'],
        color: '#E1B530'
    },
    {
        id: uuidv4(),
        name: "Gems",
        icon: ['fas', 'gem'],
        color: '#b7779f'
    }
]