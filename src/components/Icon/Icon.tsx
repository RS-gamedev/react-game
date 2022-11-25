// External
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library, IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faLightbulb,
  faFaceGrinBeam,
  faQuestion,
  faFaceMeh,
  faTree,
  faHouse,
  faTents,
  faTowerObservation,
  faCoins,
  faGem,
  faBuildingColumns,
  faUtensils,
  faWheatAwn,
  faArrowsRotate,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utils/MapUtils";
import styles from "./Icon.module.css";

type props = {
  name?: IconProp;
  color?: string;
  fontSize: string;
  imageName?: string;
  height: string;
};

library.add(
  faLightbulb,
  faFaceGrinBeam,
  faQuestion,
  faFaceMeh,
  faTree,
  faHouse,
  faTents,
  faTowerObservation,
  faCoins,
  faGem,
  faBuildingColumns,
  faUtensils,
  faWheatAwn,
  faArrowsRotate,
  faPlay
);

const Icon = ({ name, color, fontSize, imageName, height }: props) => {
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    if (!imageName) return;
    setImagePath(getImageUrl(imageName));
  }, [imageName]);

  return (
    <div className={imagePath ? styles.icon : ""}>
      {name ? <FontAwesomeIcon icon={name} color={color} fontSize={fontSize} /> : <></>}
      {!name && imagePath ? <img alt={name} src={imagePath} style={{ height: height }}></img> : <></>}
    </div>
  );
};

export default React.memo(Icon);
