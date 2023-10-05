import Game from "./pages/Game/Game";
import { useEffect, useState } from "react";
import { ObjectProps } from "./models/ObjectProps";
import MapPicker from "./pages/MapPicker/MapPicker";
import { MapPickerObject } from "./models/MapPickerObject";
import { setInitialMapObjects } from "./utils/GameUtils";
import InventoryProvider from "./providers/InventoryProvider";
import VillagersProvider from "./providers/VillagersProvider";
import MapObjectsProvider from "./providers/MapObjectsProvider";
import BuildingsProvider from "./providers/BuildingsProvider";
import GameManager from "./components/GameManager/GameManager";

function App() {
  const [map, setMap] = useState<ObjectProps[]>([]);
  const [mapReady, setMapReady] = useState(false);

  const height = document.documentElement.clientHeight;
  const width = document.documentElement.clientWidth;

  useEffect(() => {}, []);

  const onStart = (objects: MapPickerObject[]) => {
    setMap(setInitialMapObjects(objects)!);
  };

  useEffect(() => {
    if (map && map.length > 0) setMapReady(true);
  }, [map]);

  return mapReady ? <GameManager initialMapObjects={map}/> : <MapPicker onStart={onStart} mapSize={{ height: height, width: width }}></MapPicker>;
}

export default App;
