import { ObjectProps } from '../../models/ObjectProps';
import styles from './MapObject.module.css';
import { getImageUrl } from '../../utils/MapUtils';
import { useEffect, useState } from 'react';
import { Position } from '../../models/Position';


type props = {
  id: string, 
  name: string, 
  position: Position, 
  selected: boolean,
  onClick: (event: any) => ObjectProps
}

export default function MapObject({id, name, position, selected, onClick}: props) {
  const [image, setImage] = useState("");

  useEffect(() => {
    setImage(getImageUrl(name)!);
  }, []);

  return (
    <div className={styles.mapObject + " " + `${(selected) ? styles.selected: styles.nothing}`} style={{left: position.x, top: position.y}} onClick={onClick}>
      <img src={image}></img>
    </div>
  )
}