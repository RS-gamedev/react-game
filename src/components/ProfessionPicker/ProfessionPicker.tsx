import styles from './ProfessionPicker.module.css';
import { professions } from '../../config/Professions';
import ProfessionPickerItem from './ProfessionPickerItem/ProfessionPickerItem';
import { VillagerProfession } from '../../models/VillagerProfession';

type Props = {
  open: boolean;
  villagerProfessions: VillagerProfession[],
  onClick?: (villagerProfession: VillagerProfession) => void
}

export default function ProfessionPicker({ open, villagerProfessions, onClick }: Props) {
  return (open) ?
    (
      <div className={styles.professionPicker} >
        <div className={styles.professionPickerItems}>
          {
            villagerProfessions.map(prof => {
              return <ProfessionPickerItem active={prof.active} name={prof.profession.name} image={prof.profession.image} level={prof.currentLevel.level} onClick={(onClick) && (() => onClick(prof))}></ProfessionPickerItem>
            })
          }
        </div>
      </div>
    )
    : <></>
}
