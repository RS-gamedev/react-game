import React, { useEffect, useMemo } from "react";
import { MapObjectProps } from "../../models/MapObjectProps";
import MapObject from "../MapObject/MapObject";

type Props = {
  mapObjects: MapObjectProps[];
};

const MapObjectArea = React.memo(({ mapObjects }: Props) => {
  console.log("rendering mapObjectArea");

  useEffect(() => {
    console.log("MapObjectArea rendered");
  }, [mapObjects]);

  const memoArray = useMemo(() => {
    return mapObjects.map((mapObject) => {
      return (
        <MapObject
          hitBox={mapObject.hitBox}
          id={mapObject.id}
          inventory={mapObject.inventory}
          position={mapObject.position}
          name={mapObject.name}
          selected={mapObject.selected}
          size={mapObject.size}
          key={mapObject.id}
          inventoryMax={10}
        />
      );
    });
  }, [mapObjects]);

  return <>{memoArray}</>;
});

export default MapObjectArea;
