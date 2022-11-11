import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { BuildingProps } from "../../models/BuildingProps"
import Icon from "../Icon/Icon"

export default function Building(props: BuildingProps) {
  return (
    <div style={{width: props.size.width, height: props.size.heigth, left:props.position.x - 25, top:props.position.y - 25, position: 'absolute'}}>
      <Icon fontSize={props.size.width} color={props.color} name={props.icon}></Icon>
    </div>
  )
}