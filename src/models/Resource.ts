import { IconProp } from "@fortawesome/fontawesome-svg-core";

export type Resource = {
  id: string;
  name: string;
  icon?: IconProp;
  color: string;
  image?: string;
};
