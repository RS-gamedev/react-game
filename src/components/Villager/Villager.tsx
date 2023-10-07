import { useEffect, useState } from "react";
import { Hitbox } from "../../models/Hitbox";
import { VillagerProfession } from "../../models/VillagerProfession";
import Icon from "../Icon/Icon";
import styles from "./Villager.module.css";

export type VillagerComponentProps = {
  id: string;
  name: string;
  hitBox: Hitbox;
  size: { width: number; height: number };
  selected: boolean;
  professions: VillagerProfession[];
};

const Villager = ({ id, name, size, professions }: VillagerComponentProps) => {
  const [activeProfession, setActiveProfession] = useState<VillagerProfession>();

  useEffect(() => {
    setActiveProfession((prev) => {
      return professions.find((x) => x.active);
    });
  }, []);

  return (
    <div
      className={styles.villager}
    >
      <Icon height={size.height - 10 + "px"} fontSize="1em" imageName={activeProfession?.profession.characterImageName}></Icon>
    </div>
  );
}
export default Villager;