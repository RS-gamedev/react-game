import styles from './MapObject.module.css';
import React, { useState } from 'react';
import { Position } from '../../models/Position';
import { Hitbox } from '../../models/Hitbox';
import Icon from '../Icon/Icon';


type props = {
  id: string,
  name: string,
  position: Position,
  selected: boolean,
  onClick: (event: any, id: string) => void,
  onRightClick: (event: any, mapObjectId: string) => void,
  hitBox: Hitbox,
  size: {height: string, width: string}
}

const MapObject = React.memo(({ id, name, hitBox, selected, onClick, onRightClick, size }: props) => {
  console.log("Rendered mapobject");
  const [showTaskAssigned, setShowTaskAssigned] = useState<boolean>(false);

  function handleRightClick(event: any) {
    setShowTaskAssigned(() => true);
    setTimeout(() => {
      setShowTaskAssigned(() => false);
    }, 300);
    onRightClick(event, id);
  }

  return (
    <>
      {(hitBox) ?
        <div className={styles.mapObject + " " + `${(selected) ? styles.selected : styles.nothing} ` + ((showTaskAssigned) ? styles.taskAssigned : styles.taskAssignedAfter)} style={{ left: hitBox.leftTop.x, top: hitBox.leftTop.y }} onClick={(event) => onClick(event, id)} onContextMenu={handleRightClick}>
          <Icon fontSize='1em' imageName={name} height={size.height}></Icon>
        </div> : <></>}
    </>
  )
})
export default MapObject;