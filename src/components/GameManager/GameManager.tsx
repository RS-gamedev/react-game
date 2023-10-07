import { useEffect } from "react";
import { useMapObjects } from "../../hooks/useMapObjects";
import { MapObjectProps } from "../../models/MapObjectProps";
import Game from "../../pages/Game/Game";
type Props = {
  initialMapObjects: MapObjectProps[];
};
const GameManager = ({ initialMapObjects }: Props) => {
  const { mapObjects, createMapObjects } = useMapObjects();

  useEffect(() => {
    createMapObjects(initialMapObjects);
  }, []);

  return <Game></Game>;
};
export default GameManager;
