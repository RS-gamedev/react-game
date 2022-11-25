import { Position } from "./Position";
import { Size } from "./Size";

export type MapPickerObject = {
  color: string;
  position?: Position;
  size?: number;
  name: string;
  previewSize: Size;
};
