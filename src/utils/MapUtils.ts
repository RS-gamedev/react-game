import tree from '../assets/tree.svg';
import villager from '../assets/villager.png';
import townCenter from '../assets/townCenter.svg';

const objects = ['tree', 'villager', 'townCenter'];

export function getImageUrl(name: string) {
    let object = objects.find(x => x === name);
    switch (object) {
        case 'tree':
            return tree;
        case 'villager':
            return villager;
        case 'townCenter':
            return townCenter
        default:
            return tree;
    }

}