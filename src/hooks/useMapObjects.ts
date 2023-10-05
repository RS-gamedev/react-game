import { useContext } from 'react';
import { MapObjectsContext } from '../context/mapObjects/mapObjectsContext';
import { MapObjectContextProps } from '../context/mapObjects/mapObjectsContextProps';

export const useMapObjects = (): MapObjectContextProps => useContext(MapObjectsContext);