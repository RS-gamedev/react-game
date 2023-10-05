import React from "react";
import { ObjectProps } from "../../models/ObjectProps";
import Game from "../../pages/Game/Game";
import BuildingsProvider from "../../providers/BuildingsProvider";
import InventoryProvider from "../../providers/InventoryProvider";
import MapObjectsProvider from "../../providers/MapObjectsProvider";
import VillagersProvider from "../../providers/VillagersProvider";
type Props = {
  initialMapObjects: ObjectProps[];
  mapSize: {
    width: number;
    height: number;
  };
};
const GameManager = ({ mapSize, initialMapObjects }: Props) => {
  console.log("Init GameManager");
  return (
    <InventoryProvider>
      <VillagersProvider>
        <MapObjectsProvider>
          <BuildingsProvider mapSize={mapSize}>
            <Game initialMapObjects={initialMapObjects} mapSize={{ height: mapSize.height, width: mapSize.width }}></Game>
          </BuildingsProvider>
        </MapObjectsProvider>
      </VillagersProvider>
    </InventoryProvider>
  );
};
export default GameManager;
