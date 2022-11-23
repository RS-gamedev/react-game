import tree from '../assets/tree.svg';
import villager from '../assets/villager.svg';
import townCenter from '../assets/townCenter.svg';
import axe from '../assets/axe.svg';
import none from '../assets/none.svg';
import lumberjack from '../assets/lumberjack.svg';
import farmer from '../assets/farmer.svg';
import hoe from '../assets/hoe.svg';
import house from '../assets/house.svg';

const objects = ['tree', 'villager', 'townCenter', 'axe', 'none', 'hoe', 'lumberjack', 'farmer', 'house'];

export const getImageUrl = (name: string) => {
    let object = objects.find(x => x === name);
    switch (object) {
        case 'tree':
            return tree;
        case 'villager':
            return villager;
        case 'townCenter':
            return townCenter;
        case 'axe':
            return axe;
            case 'hoe':
                return hoe
        case 'none':
            return none;
        case 'lumberjack':
            return lumberjack;
        case 'farmer':
            return farmer;
            case 'house':
                return house;
        default:
            return tree;
    }

}