import { Position } from "../../models/Position";
import { Size } from "../../models/Size";
import styles from "./PlacementOverlay.module.css";
type Props = {
  size?: Size;
  circle?: boolean;
  centerPosition?: Position;
  fullscreen?: boolean;
  villagerId?: string;
  onClick: (event: any, villagerId?: string) => void;
};

export default function PlacementOverlay({ size, circle, centerPosition, fullscreen, onClick, villagerId }: Props) {
  return fullscreen || !size || !centerPosition ? (
    <div onClick={(event) => onClick(event, villagerId)} className={styles.placementOverlay} style={{ width: "100%", height: "100%", left: 0, top: 0 }}></div>
  ) : (
    <div
      onClick={(event) => onClick(event, villagerId)}
      className={`${styles.placementOverlay} ${circle && styles.circle}`}
      style={{ width: size.width, height: size.height, left: centerPosition.x - size.width / 2, top: centerPosition.y - size.height / 2 }}
    ></div>
  );
}
