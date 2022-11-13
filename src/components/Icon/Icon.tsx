import React from 'react';
import styles from './Icon.module.scss';

// External
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library, icon, IconProp } from '@fortawesome/fontawesome-svg-core';
import { faLightbulb, faFaceGrinBeam, faQuestion, faFaceMeh, faTree, faHouse, faTents, faTowerObservation, faCoins, faGem, faBuildingColumns } from '@fortawesome/free-solid-svg-icons';

// var tree = {
//     prefix: 'fab',
//     iconName: 'tree',
//     icon: [
//       width,
//       height,
//       ligatures,
//       unicode,
//       svgPathData
// }

type props = {
  name?: IconProp,
  color?: string,
  fontSize: string
}

library.add(faLightbulb, faFaceGrinBeam, faQuestion, faFaceMeh, faTree, faHouse, faTents, faTowerObservation, faCoins, faGem, faBuildingColumns);

const Icon = ({ name, color, fontSize }: props) => {
  return (
    <div className="icon">
      {(name) ?
        <FontAwesomeIcon className="icon" icon={name} color={color} fontSize={fontSize} /> : <></>
      }
    </div>
  );
};

export default Icon;