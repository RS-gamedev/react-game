import styles from './MapObject.module.css';
import { getImageUrl } from '../../utils/MapUtils';
import React, { useEffect, useState } from 'react';
import { Position } from '../../models/Position';
import { Hitbox } from '../../models/Hitbox';
import Icon from '../Icon/Icon';
import { VillagerType } from '../../models/enums/VillagerType';


type props = {
  id: string,
  name: string,
  position: Position,
  selected: boolean,
  onClick: (event: any, id: string) => void,
  onRightClick: (event: any, objectHitbox: Hitbox) => void,
  hitBox: Hitbox,
}

const MapObject = React.memo(({ id, name, hitBox, selected, onClick, onRightClick }: props) => {
  const [showTaskAssigned, setShowTaskAssigned] = useState<boolean>(false);

  function handleRightClick(event: any) {
    setShowTaskAssigned(() => true);
    setTimeout(() => {
      setShowTaskAssigned(() => false);
    }, 300);
    onRightClick(event, hitBox);
  }

  return (
    <>
      {(hitBox) ?
        <div className={styles.mapObject + " " + `${(selected) ? styles.selected : styles.nothing} ` + ((showTaskAssigned) ? styles.taskAssigned : styles.taskAssignedAfter)} style={{ left: hitBox.leftTop.x, top: hitBox.leftTop.y }} onClick={(event) => onClick(event, id)} onContextMenu={handleRightClick}>
          <Icon fontSize='1em' type={name}></Icon>
        </div> : <></>}
    </>
  )
})
export default MapObject;