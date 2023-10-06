import { useEffect, useState } from "react";
import { Hitbox } from "../../models/Hitbox";
import { VillagerProfession } from "../../models/VillagerProfession";
import Icon from "../Icon/Icon";
import styles from "./Villager.module.css";

type props = {
  id: string;
  name: string;
  hitBox: Hitbox;
  size: { width: number; height: number };
  selected: boolean;
  professions: VillagerProfession[];
};

export default function Villager({ id, name, size, hitBox, selected, professions }: props) {
  const [activeProfession, setActiveProfession] = useState<VillagerProfession>();

  useEffect(() => {
    setActiveProfession((prev) => {
      return professions.find((x) => x.active);
    });
  }, [professions]);

  return (
    <div
      className={styles.villager + ` ${selected ? styles.selected : styles.nothing}`}
      style={{
        width: size.width,
        height: size.height,
        left: hitBox.leftTop.x,
        top: hitBox.leftTop.y,
      }}
    >
      <Icon height={size.height - 10 + "px"} fontSize="1em" imageName={activeProfession?.profession.characterImageName}></Icon>
    </div>
  );
}
