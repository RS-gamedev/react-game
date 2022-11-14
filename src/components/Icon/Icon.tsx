// External
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library, IconProp } from '@fortawesome/fontawesome-svg-core';
import { faLightbulb, faFaceGrinBeam, faQuestion, faFaceMeh, faTree, faHouse, faTents, faTowerObservation, faCoins, faGem, faBuildingColumns } from '@fortawesome/free-solid-svg-icons';

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