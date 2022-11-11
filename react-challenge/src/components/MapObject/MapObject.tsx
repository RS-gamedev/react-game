import { ObjectProps } from '../../models/ObjectProps';
import styles from './MapObject.module.css';
import tree from '../../assets/tree.svg';
import { getImageUrl } from '../../utils/MapUtils';


export default function MapObject({id, name, position}: ObjectProps) {
  return (
    <div className={styles.mapObject} style={{left: position.x, top: position.y}}>
      <img src={getImageUrl(name)}></img>
    </div>
  )
}