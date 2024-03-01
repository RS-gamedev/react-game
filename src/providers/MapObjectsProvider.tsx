import { useCallback, useReducer } from "react";
import { MapObjectsContext } from "../context/mapObjects/mapObjectsContext";
import { MapObjectContextProps } from "../context/mapObjects/mapObjectsContextProps";
import { MapObjectProps } from "../models/MapObjectProps";

// Action types
type ActionType =
  | { type: "SELECT"; payload: string }
  | { type: "OVERWRITE"; payload: MapObjectProps[] }
  | { type: "DESELECT"; payload: string }
  | { type: "SET"; payload: MapObjectProps[] }
  | { type: "DESELECT_ALL"; payload: null }
  | { type: "ADD"; payload: MapObjectProps };

function mapObjectsReducer(state: MapObjectProps[], action: ActionType): MapObjectProps[] {
  switch (action.type) {
    case "SELECT":
      return [
        ...state.map((mapObjectEntity) => {
          if (mapObjectEntity.id === action.payload) {
            return { ...mapObjectEntity, selected: true };
          }
          return mapObjectEntity;
        }),
      ];
    case "ADD":
      const newBuilding = action.payload;
      return [...state.map((mapObject) => ({ ...mapObject, selected: false })), newBuilding];
    case "OVERWRITE":
      return action.payload.map((mapObject) => {
        return mapObject;
      });
    case "DESELECT_ALL":
      if (state.find((mapObject) => mapObject.selected)) {
        return [
          ...state.map((mapObjectEntity) => {
            if (mapObjectEntity.selected) return { ...mapObjectEntity, selected: false };
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

  const selectMapObject = useCallback((mapObjectId: string) => {
    dispatch({ type: "SELECT", payload: mapObjectId });
  }, []);

  const createMapObjects = (mapObjects: MapObjectProps[]) => {
    dispatch({ type: "OVERWRITE", payload: mapObjects });
  };

  const setMapObjects = (mapObjectsEntities: MapObjectProps[]) => {
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
