import { useContext, useMemo } from "react";
import { MapObjectsContext } from "../context/mapObjects/mapObjectsContext";
import { MapObjectContextProps } from "../context/mapObjects/mapObjectsContextProps";

export const useMapObjects = (): MapObjectContextProps => {
  const context = useContext(MapObjectsContext);
  return useMemo(() => context, [context]);
};
