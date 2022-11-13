import { useEffect, useState } from 'react';
import { Position } from '../../models/Position';
import { VillagerProps } from '../../models/VillagerProps';
import { getImageUrl } from '../../utils/MapUtils';
import styles from './Villager.module.css';

type props = {
  id: string;
  name: string;
  position: Position;
  onClick: (event: any) => VillagerProps;
  selected:boolean;
}

export default function Villager({ id, name, position, onClick, selected}: props) {

  const [image, setImage] = useState("");
  useEffect(() => {
    setImage(getImageUrl('villager')!);
  }, []);

  return (
    <div className={styles.villager + " " + `${(selected) ? styles.selected: styles.nothing}`}style={{ left: position.x, top: position.y }} onClick={onClick}>
      <img style={{ height: '100%' }} src={image}></img>
    </div>
  )
}