import styles from "./MapObject.module.css";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Position } from "../../models/Position";
import { Hitbox } from "../../models/Hitbox";
import Icon from "../Icon/Icon";
import { InventoryItem } from "../../models/InventoryItem";
import EntityWrapper from "../EntityWrapper/EntityWrapper";
import UIMapObject from "../../ui/ui-map-object/UIMapObject";
import { Size } from "../../models/Size";
import { useGame } from "../../providers/GameProvider";
import { MapObjectProps } from "../../models/MapObjectProps";
import { useMapObjects } from "../../hooks/useMapObjects";

type props = {
  id: string;
  name: string;
  position: Position;
  hitBox: Hitbox;
  selected: boolean;
  size: Size;
  inventoryMax: number;
  inventory: InventoryItem[];
};

const MapObject = memo(({ id, name, hitBox, inventoryMax, inventory, selected, size }: props) => {
  // const [showTaskAssigned, setShowTaskAssigned] = useState<boolean>(false);
  console.log("rendering mapobject");

  const { selectMapObject } = useMapObjects();

  const handleSelect = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      if (!selectMapObject) return;
      selectMapObject(id);
    },
    [id, selectMapObject]
  );

  const child = useMemo(() => <UIMapObject showTaskAssigned={true} stockMax={inventoryMax} stockRemaining={inventory[0].amount} name="name" />, []);

  const handleRightClick = useCallback((event: any) => {
    console.log("right click");
  }, []);

  useEffect(() => {
    console.log("MapObject useEffect");
  }, [id, name, hitBox, inventoryMax, inventory, selected, size]);

  return (
    <EntityWrapper entityId={id} hitBox={hitBox} onClick={handleSelect} onRightClick={handleRightClick} selected={selected} size={size}>
      {child}
    </EntityWrapper>
  );
});
export default MapObject;

// type Props = Partial<MapObjectProps>;

// export default function MapObject({ id, name, position, hitBox, selected, size, inventoryMax, inventory }: Props) {

//   console.log("render", id, name, position, hitBox, selected, size, inventoryMax, inventory);
//   const child = useMemo(() => <UIMapObject showTaskAssigned={true} stockMax={inventoryMax || 10} stockRemaining={10} name="name" />, []);

//   console.log(child);
//   // if (!id || !name || !position || !hitBox || !selected || !size || !inventoryMax || !inventory) return <></>;


//   return (
//     <EntityWrapper entityId={id|| ""} hitBox={hitBox!} selected={selected!} size={size!}>
//       {child}
//     </EntityWrapper>
//   );
// }
