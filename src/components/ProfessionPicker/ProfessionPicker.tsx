import styles from "./ProfessionPicker.module.css";
import ProfessionPickerItem from "./ProfessionPickerItem/ProfessionPickerItem";
import { VillagerProfession } from "../../models/VillagerProfession";
import React, { useEffect, useState } from "react";

type Props = {
  open: boolean;
  villagerProfessions: VillagerProfession[];
  onClick: (villagerProfession: VillagerProfession) => void;
};

const ProfessionPicker = ({ open, villagerProfessions, onClick }: Props) => {
  const [selectedVillagerProfession, setSelectedVillagerProfession] = useState<VillagerProfession>();

  useEffect(() => {
    let selected = villagerProfessions.find((x) => x.active);
    if (!selected) return;
    setSelectedVillagerProfession(selected);
  }, [villagerProfessions]);

  const handleChangeProfession = (villagerProfessionId: string) => {
    let toSelect = villagerProfessions.find((x) => x.id === villagerProfessionId);
    if (!toSelect) return;
    setSelectedVillagerProfession(toSelect);
    onClick(toSelect);
  };

  return open ? (
    <div className={styles.professionPicker}>
      <div className={styles.professionPickerItems}>
        {villagerProfessions.map((prof) => {
          return (
            <ProfessionPickerItem
              key={prof.id}
              id={prof.id}
              active={selectedVillagerProfession?.id === prof.id ? prof.active : false}
              name={prof.profession.name}
              image={prof.profession.image}
              level={prof.currentLevel.level}
              onClick={handleChangeProfession}
            ></ProfessionPickerItem>
          );
        })}
      </div>
    </div>
  ) : (
    <></>
  );
};
export default ProfessionPicker;
