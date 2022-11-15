import styles from './MapObject.module.css';
import { getImageUrl } from '../../utils/MapUtils';
import React, { useEffect, useState } from 'react';
import { Position } from '../../models/Position';
import { Hitbox } from '../../models/Hitbox';


type props = {
  id: string,
  name: string,
  position: Position,
  selected: boolean,
  onClick: (event: any, id: string) => void,
  onRightClick: (event: any, objectHitbox: Hitbox) => void,
  hitBox: Hitbox
}

const MapObject = React.memo(({ id, name, hitBox, selected, onClick, onRightClick }: props) => {
  const [image, setImage] = useState("");
  const [showTaskAssigned, setShowTaskAssigned] = useState<boolean>(false);

  useEffect(() => {
    setImage(getImageUrl(name)!);
  }, [name]);

  function handleRightClick(event: any){
    setShowTaskAssigned(() => true);
    setTimeout(() => {
      setShowTaskAssigned(() => false);
    }, 300);
    onRightClick(event, hitBox);
  }

  if(hitBox){
    return (
      <div className={styles.mapObject + " " + `${(selected) ? styles.selected : styles.nothing} ` + ((showTaskAssigned) ? styles.taskAssigned : styles.taskAssignedAfter) } style={{ left: hitBox.leftTop.x, top: hitBox.leftTop.y }} onClick={(event) => onClick(event, id)} onContextMenu={handleRightClick}>
        <img alt={name} src={image}></img>
      </div>
    )
  }
  return <></>
})
export default MapObject;