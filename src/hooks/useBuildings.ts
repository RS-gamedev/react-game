import { useContext } from 'react';
import { BuildingsContext } from '../context/buildings/buildingsContext';
import { BuildingsContextProps } from '../context/buildings/buildingsContextProps';

export const useBuildings = (): BuildingsContextProps => useContext(BuildingsContext);