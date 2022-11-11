import tree from '../assets/tree.svg';
import villager from '../assets/villager.png';
const objects = ['tree', 'villager'];

export function getImageUrl(name: string) {
    let object = objects.find(x => x === name);
    switch (object) {
        case 'tree':
            return tree;
        case 'villager':
            return villager;
        default:
            break;
    }

}