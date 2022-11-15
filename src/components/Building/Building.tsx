import { IconProp } from "@fortawesome/fontawesome-svg-core"
import React, { useEffect } from "react";
import { Hitbox } from "../../models/Hitbox";
import { ObjectProps } from "../../models/ObjectProps"
import { Position } from "../../models/Position";
import { getHitBoxCenter } from "../../utils/StatusUtils";
import Icon from "../Icon/Icon"
import styles from './Building.module.css';


type props = {
  id: string;
  size: { width: string, height: string },
  hitBox: Hitbox,
  icon: IconProp,
  color: string,
  selected: boolean,
  onClick: (event: any, buildingId: string) => void,
  onRightClick: (event: any) => void
}

const Building = React.memo(({ id, size, hitBox, icon, color, onClick, selected, onRightClick }: props) => {
  console.log(hitBox);
  const position: Position = getHitBoxCenter(hitBox);
  console.log(position);

  console.log("rendering building");
  return (
    <div className={styles[(selected) ? `active` : `not-active`] + " " + styles['building']} style={{ width: size.width, height: size.width, left: position.x, top: position.y, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(event) => onClick(event, id)} onContextMenu={onRightClick}>
      <Icon fontSize={size.width} color={color} name={icon}></Icon>
    </div>
  )
})
export default Building;