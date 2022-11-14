import { ObjectProps } from '../../models/ObjectProps';
import styles from './MapObject.module.css';
import { getImageUrl } from '../../utils/MapUtils';
import React, { useEffect, useState } from 'react';
import { Position } from '../../models/Position';


type props = {
  id: string,
  name: string,
  position: Position,
  selected: boolean,
  onClick: (event: any, id: string) => ObjectProps | undefined
}

const MapObject = React.memo(({ id, name, position, selected, onClick }: props) => {
  const [image, setImage] = useState("");

  useEffect(() => {
    setImage(getImageUrl(name)!);
  }, [name]);

  return (
    <div className={styles.mapObject + " " + `${(selected) ? styles.selected : styles.nothing}`} style={{ left: position.x, top: position.y }} onClick={(event) => onClick(event, id)}>
      <img alt={name} src={image}></img>
    </div>
  )
})

export default MapObject;