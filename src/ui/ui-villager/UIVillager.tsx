import { memo } from "react";
import Icon from "../../components/Icon/Icon";
import { Size } from "../../models/Size";
import styles from "./UIVillager.module.css";
type Props = {
  size: Size;
};

const UIVillager = memo(({ size }: Props) => {
    console.log("rendered UIVillager");
  return (
    <div className={styles.villager}>
      <Icon height={size.height - 10 + "px"} fontSize="1em" imageName="villager"></Icon>
    </div>
  );
});

export default UIVillager;
