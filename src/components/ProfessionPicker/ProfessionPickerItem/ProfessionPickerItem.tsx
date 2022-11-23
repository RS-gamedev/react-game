import Icon from '../../Icon/Icon';
import styles from './ProfessionPickerItem.module.css';

type Props = {
    image: string,
    name: string,
    level: number,
    active: boolean,
    id: string,
    onClick: (villagerProfessionId: string) => void
}

export default function ProfessionPickerItem({ image, name, level, active, onClick, id }: Props) {
    return (
        <div className={`${styles.professionPickerItem} ${(active) ? styles.active : ""}`} onClick={() => onClick(id)}>
            <div className={styles.imageSection}>
                <Icon imageName={image} fontSize='1em' height='35px'></Icon>
            </div>
            <div className={styles.nameSection}>
                <span>{name}</span>

            </div>
            <div className={styles.levelSection}>
                <span>Lvl {level}</span>
            </div>
        </div>
    )
}