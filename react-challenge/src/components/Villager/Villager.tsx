import { useEffect, useState } from 'react';
import { VillagerProps } from '../../models/VillagerProps';
import { getImageUrl } from '../../utils/MapUtils';
import styles from './Villager.module.css';

export default function Villager({id, name, position}: VillagerProps) {

  const [image, setImage] = useState("");
  useEffect(() => {
    setImage(getImageUrl('villager')!);
  }, []);
    
  return (
    <div className={styles.villager} style={{left: position.x, top: position.y}}>
        <img style={{height:'100%'}}src={image}></img>
    </div>
  )
}