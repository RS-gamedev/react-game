import { useContext } from 'react';
import { VillagersContext } from '../context/villagers/villagersContext';
import { VillagersContextProps } from '../context/villagers/villagersContextProps';
import { VillagerProps } from '../models/VillagerProps';

export const useVillagers = (): VillagersContextProps => useContext(VillagersContext);