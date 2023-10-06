import { useEffect, useState } from "react";
import GameManager from "./components/GameManager/GameManager";
import { MapPickerObject } from "./models/MapPickerObject";
import { MapObjectProps } from "./models/MapObjectProps";
import MapPicker from "./pages/MapPicker/MapPicker";
import { setInitialMapObjects } from "./utils/GameUtils";

function App() {
  const [map, setMap] = useState<MapObjectProps[]>([]);
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
