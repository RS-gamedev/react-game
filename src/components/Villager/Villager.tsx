import { useEffect, useState } from 'react';
import { Hitbox } from '../../models/Hitbox';
import { Position } from '../../models/Position';
import { getImageUrl } from '../../utils/MapUtils';
import styles from './Villager.module.css';

type props = {
  id: string;
  name: string;
  hitBox: Hitbox;
  size: {width: string, height: string};
  onClick: (event: any, villagerId: string) => void
  selected: boolean;
}

export default function Villager({ id, name, size, hitBox, onClick, selected }: props) {
  const [image, setImage] = useState("");
  useEffect(() => {
    setImage(getImageUrl('villager')!);
  }, []);


  return (
    <div className={styles.villager + " " + `${(selected) ? styles.selected : styles.nothing}`} style={{ width: size.width, height: size.height, left: hitBox.leftTop.x, top: hitBox.leftTop.y }} onClick={(event) => onClick(event, id)}>
      <img style={{ height: '100%' }} src={image}></img>
    </div>
  )
}