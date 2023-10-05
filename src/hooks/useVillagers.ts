import { useContext } from 'react';
import { VillagersContext } from '../context/villagers/villagersContext';
import { VillagersContextProps } from '../context/villagers/villagersContextProps';

export const useVillagers = (): VillagersContextProps => useContext(VillagersContext);