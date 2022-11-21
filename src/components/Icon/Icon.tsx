// External
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library, IconProp } from '@fortawesome/fontawesome-svg-core';
import { faLightbulb, faFaceGrinBeam, faQuestion, faFaceMeh, faTree, faHouse, faTents, faTowerObservation, faCoins, faGem, faBuildingColumns } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { getImageUrl } from '../../utils/MapUtils';
import styles from './Icon.module.css';


type props = {
  name?: IconProp,
  color?: string,
  fontSize: string,
  imageName?: string,
  height: string
}

library.add(faLightbulb, faFaceGrinBeam, faQuestion, faFaceMeh, faTree, faHouse, faTents, faTowerObservation, faCoins, faGem, faBuildingColumns);

const Icon = ({ name, color, fontSize, imageName, height }: props) => {
  console.log("Rendered Icon");
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    if(!imageName) return;
    setImagePath(getImageUrl(imageName));
  }, [imageName]);

  useEffect(() => {
    console.log("JUUUUP");
  }, [height])

  
  return (
    <div className={(imagePath) ? styles.icon : ""}>
      {(name) ?
        <FontAwesomeIcon icon={name} color={color} fontSize={fontSize} /> : <></>
      }
      {(!name && imagePath) ?
        <img src={imagePath} style={{height: height}}></img> : <></>
      }
    </div>
  );
};

export default React.memo(Icon);