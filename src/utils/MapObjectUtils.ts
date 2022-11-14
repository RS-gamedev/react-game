import { ObjectProps } from "../models/ObjectProps";

export function setSelectedMapObject(mapObjects: ObjectProps[], toSelect: ObjectProps){
    let mapObjectsCopy = [...mapObjects];
    let selectedMapObject = mapObjectsCopy.find(x => x.id === toSelect.id);
    if (selectedMapObject) {
        selectedMapObject.selected = true;
    }
    mapObjectsCopy.filter(x => x.id !== toSelect.id).forEach(x => x.selected = false);
    return mapObjectsCopy;
}

export function deselectAllMapObjects(mapObjects: ObjectProps[]){
    let mapObjectsCopy = [...mapObjects];
    mapObjectsCopy.forEach(x => x.selected = false);
    return mapObjectsCopy;
}