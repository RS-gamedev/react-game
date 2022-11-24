import { Position } from "./Position";
import { Shape } from "./Shape";
import { Size } from "./Size";

export type PlacementOverlayConfig = {
  show: boolean;
  size?: Size;
  centerPosition?: Position;
  circle?: boolean;
  fullscreen?: boolean;
  selectedShape?: Shape;
};
