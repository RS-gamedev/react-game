import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { BuildingProps } from "../../models/BuildingProps"
import { ObjectProps } from "../../models/ObjectProps"
import Icon from "../Icon/Icon"
import styles from './Building.module.css';


type props = {
  size: {width: string, height: string},
  position: {x: number, y: number},
  icon: IconProp,
  color: string,
  selected: boolean,
  onClick: (event: any) => ObjectProps
}

export default function Building({size, position, icon, color, onClick, selected} : props) {
  return (
    <div className={styles[(selected) ? `active` : `not-active`] + " " + styles['building'] } style={{width: size.width, height: size.height, left:position.x - 25, top:position.y - 25, position: 'absolute', display:'flex', alignItems:'center', justifyContent: 'center'}} onClick={onClick}>
      <Icon fontSize={size.width} color={color} name={icon}></Icon>
    </div>
  )
}