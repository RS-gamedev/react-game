import styles from './ProfessionPicker.module.css';
import { professions } from '../../config/Professions';
import ProfessionPickerItem from './ProfessionPickerItem/ProfessionPickerItem';
import { VillagerProfession } from '../../models/VillagerProfession';
import React, { useEffect } from 'react';

type Props = {
  open: boolean;
  villagerProfessions: VillagerProfession[],
  onClick: (villagerProfession: VillagerProfession) => void
}

const ProfessionPicker = ({ open, villagerProfessions, onClick }: Props) => {

  console.log("Rendered ProfessionPicker");

  useEffect(() => {
    console.log("onclick changed");
  }, [onClick])

  return (open) ?
    (
      <div className={styles.professionPicker} >
        <div className={styles.professionPickerItems}>
          {
            villagerProfessions.map(prof => {
              return <ProfessionPickerItem active={prof.active} name={prof.profession.name} image={prof.profession.image} level={prof.currentLevel.level} onClick={(() => onClick(prof)!)}></ProfessionPickerItem>
            })
          }
        </div>
      </div>
    )
    : <></>
}
export default React.memo(ProfessionPicker);