import { useReducer } from "react";
import MapObject from "../components/MapObject/MapObject";
import { MapObjectsContext } from "../context/mapObjects/mapObjectsContext";
import { MapObjectContextProps } from "../context/mapObjects/mapObjectsContextProps";
import { MapObjectEntity } from "../models/MapObjectEntity";
import { MapObjectProps } from "../models/MapObjectProps";

const createMapObjectEntity = (mapObject: MapObjectProps): MapObjectEntity => {
  return {
    component: <MapObject {...mapObject} />,
    mapObject: mapObject,
  };
};

// Action types
type ActionType =
  | { type: "SELECT"; payload: string }
  | { type: "OVERWRITE"; payload: MapObjectProps[] }
  | { type: "DESELECT"; payload: string }
  | { type: "SET"; payload: MapObjectEntity[] }
  | { type: "DESELECT_ALL"; payload: null }
  | { type: "ADD"; payload: MapObjectProps };

function mapObjectsReducer(state: MapObjectEntity[], action: ActionType): MapObjectEntity[] {
  switch (action.type) {
    case "SELECT":
      return [
        ...state.map((mapObjectEntity) => {
          if (mapObjectEntity.mapObject.id === action.payload) {
            return createMapObjectEntity({ ...mapObjectEntity.mapObject, selected: true });
          }
          return mapObjectEntity;
        }),
      ];
    case "ADD":
      const newBuilding = createMapObjectEntity(action.payload);
      return [...state.map((mapObject) => ({ ...mapObject, selected: false })), newBuilding];
    case "OVERWRITE":
      return action.payload.map((mapObject) => {
        return createMapObjectEntity(mapObject);
      });
    case "DESELECT_ALL":
      if (state.find((mapObject) => mapObject.mapObject.selected)) {
        return [
          ...state.map((mapObjectEntity) => {
            if (mapObjectEntity.mapObject.selected) return createMapObjectEntity({ ...mapObjectEntity.mapObject, selected: false });
            return mapObjectEntity;
          }),
        ];
      }
      return state;
    case "SET":
      return action.payload;
    default:
      return state;
  }
}

type Props = { children: any };
const MapObjectsProvider = ({ children }: Props) => {
  const [mapObjects, dispatch] = useReducer(mapObjectsReducer, []);

  const addMapObject = (mapObject: MapObjectProps) => {
    dispatch({ type: "ADD", payload: mapObject });
  };

  const deselectAllMapObjects = () => {
    dispatch({ type: "DESELECT_ALL", payload: null });
  };

  const selectMapObject = (mapObjectId: string) => {
    dispatch({ type: "SELECT", payload: mapObjectId });
  };

  const createMapObjects = (mapObjects: MapObjectProps[]) => {
    dispatch({ type: "OVERWRITE", payload: mapObjects });
  };

  const setMapObjects = (mapObjectsEntities: MapObjectEntity[]) => {
    dispatch({ type: "SET", payload: mapObjectsEntities });
  };

  const value: MapObjectContextProps = {
    mapObjects: mapObjects || [],
    setMapObjects: setMapObjects,
    createMapObjects: createMapObjects,
    deselectAllMapObjects: deselectAllMapObjects,
    selectMapObject: selectMapObject,
    addMapObject,
  };

  return <MapObjectsContext.Provider value={value}>{children}</MapObjectsContext.Provider>;
};

export default MapObjectsProvider;
