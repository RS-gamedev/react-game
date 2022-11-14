import { IconProp } from "@fortawesome/fontawesome-svg-core"
import React, { useEffect } from "react";
import { ObjectProps } from "../../models/ObjectProps"
import Icon from "../Icon/Icon"
import styles from './Building.module.css';


type props = {
  id: string;
  size: { width: string, height: string },
  position: { x: number, y: number },
  icon: IconProp,
  color: string,
  selected: boolean,
  onClick: (event: any, buildingId: string) => void
}

const Building = React.memo(({ id, size, position, icon, color, onClick, selected }: props) => {
  console.log("rendering building");
  useEffect(() => {
  }, [id, size, position, icon, color, onClick, selected]);


  return (
    <div className={styles[(selected) ? `active` : `not-active`] + " " + styles['building']} style={{ width: size.width, height: size.height, left: position.x - 25, top: position.y - 25, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(event) => onClick(event, id)}>
      <Icon fontSize={size.width} color={color} name={icon}></Icon>
    </div>
  )
})
export default Building;