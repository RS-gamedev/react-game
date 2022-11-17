// External
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library, IconProp } from '@fortawesome/fontawesome-svg-core';
import { faLightbulb, faFaceGrinBeam, faQuestion, faFaceMeh, faTree, faHouse, faTents, faTowerObservation, faCoins, faGem, faBuildingColumns } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { getImageUrl } from '../../utils/MapUtils';
import { VillagerType } from '../../models/enums/VillagerType';

type props = {
  name?: IconProp,
  color?: string,
  fontSize: string,
  type?: VillagerType | string
}

library.add(faLightbulb, faFaceGrinBeam, faQuestion, faFaceMeh, faTree, faHouse, faTents, faTowerObservation, faCoins, faGem, faBuildingColumns);

const Icon = ({ name, color, fontSize, type }: props) => {

  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    if(type){
      switch (type) {
        case VillagerType.VILLAGER:
          setImagePath(getImageUrl('villager')!);
          break;
        case VillagerType.LUMBERJACK:
          setImagePath(getImageUrl('lumberjack')!);
        break;
        default:
          setImagePath(getImageUrl('tree')!);
          break;
      }
    }
  }, []);
  
  return (
    <div className="icon">
      {(name) ?
        <FontAwesomeIcon className="icon" icon={name} color={color} fontSize={fontSize} /> : <></>
      }
      {(imagePath) ?
        <img src={imagePath}></img> : <></>
      }
    </div>
  );
};

export default Icon;