import React from "react";
import { MapObjectProps } from "../../models/MapObjectProps";
import Game from "../../pages/Game/Game";
import BuildingsProvider from "../../providers/BuildingsProvider";
import InventoryProvider from "../../providers/InventoryProvider";
import MapObjectsProvider from "../../providers/MapObjectsProvider";
import VillagersProvider from "../../providers/VillagersProvider";
type Props = {
  initialMapObjects: MapObjectProps[];
};
const GameManager = ({ initialMapObjects }: Props) => {
  return (
    <InventoryProvider>
      <VillagersProvider>
        <BuildingsProvider>
          <MapObjectsProvider>
            <Game initialMapObjects={initialMapObjects}></Game>
          </MapObjectsProvider>
        </BuildingsProvider>
      </VillagersProvider>
    </InventoryProvider>
  );
};
export default GameManager;
