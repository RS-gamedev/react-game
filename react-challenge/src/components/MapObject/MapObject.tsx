import { ObjectProps } from '../../models/ObjectProps';
import styles from './MapObject.module.css';
import { getImageUrl } from '../../utils/MapUtils';
import { useEffect, useState } from 'react';


export default function MapObject({id, name, position}: ObjectProps) {
  const [image, setImage] = useState("");
  useEffect(() => {
    setImage(getImageUrl(name)!);
  }, []);
  return (
    <div className={styles.mapObject} style={{left: position.x, top: position.y}}>
      <img src={image}></img>
    </div>
  )
}