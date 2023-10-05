import { useContext } from 'react';
import { InventoryContext } from '../context/inventory/inventoryContext';
import { InventoryContextProps } from '../context/inventory/InventoryContextProps';

export const useInventory = (): InventoryContextProps => useContext(InventoryContext);