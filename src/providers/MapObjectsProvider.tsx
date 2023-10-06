import { useReducer } from "react";
import MapObject from "../components/MapObject/MapObject";
import { MapObjectsContext } from "../context/mapObjects/mapObjectsContext";
import { MapObjectContextProps } from "../context/mapObjects/mapObjectsContextProps";
import { EntityElementType } from "../models/EntityElementType";
import { MapObjectProps } from "../models/MapObjectProps";
import { Position } from "../models/Position";

// Action types
type ActionType =
  | { type: "SELECT"; payload: string }
  | { type: "OVERWRITE"; payload: MapObjectProps[] }
  | { type: "DESELECT"; payload: string }
  | { type: "SET"; payload: EntityElementType[] }
  | { type: "DESELECT_ALL"; payload: null }
  | { type: "ADD"; payload: { mapObject: MapObjectProps; position: Position } };

function mapObjectsReducer(state: EntityElementType[], action: ActionType): EntityElementType[] {
  switch (action.type) {
    case "SELECT":
      return state.map((mapObject) => (mapObject.component.props.id === action.payload ? { ...mapObject, selected: true } : mapObject));
    case "ADD":
      const newBuilding: EntityElementType = {
        component: <MapObject {...action.payload.mapObject} />,
        selected: true,
        updated: false,
      };
      return [...state.map((mapObject) => ({ ...mapObject, selected: false })), newBuilding];
    case "OVERWRITE":
      return action.payload.map((mapObject) => {
        return { component: <MapObject {...mapObject} />, selected: false, updated: false };
      });
    case "DESELECT_ALL":
      return [...state.map((mapObject) => ({ ...mapObject, selected: false }))];
    case "SET":
      return action.payload;
    default:
      return state;
  }
}

type Props = { children: any };
const MapObjectsProvider = ({ children }: Props) => {
  const [mapObjects, dispatch] = useReducer(mapObjectsReducer, []);

  console.log("Init mapobjectsprovider");

  const addMapObject = (mapObject: MapObjectProps, position: Position) => {
    dispatch({ type: "ADD", payload: { mapObject, position } });
  };

  const deselectAllMapObjects = () => {
    dispatch({ type: "DESELECT_ALL", payload: null });
  };

  const selectMapObject = (mapObjectId: string) => {
    console.log("selecting map object");
    dispatch({ type: "SELECT", payload: mapObjectId });
  };

  const createMapObjects = (mapObjects: MapObjectProps[]) => {
    console.log("creating Map Objects");
    dispatch({ type: "OVERWRITE", payload: mapObjects });
  };

  const setMapObjects = (mapObjectsEntities: EntityElementType[]) => {
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
