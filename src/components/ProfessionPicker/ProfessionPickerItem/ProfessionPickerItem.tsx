import Icon from '../../Icon/Icon';
import styles from './ProfessionPickerItem.module.css';

type Props = {
    image: string,
    name: string,
    level: number,
    active: boolean,
    onClick?: () => void
}

export default function ProfessionPickerItem({ image, name, level, active, onClick }: Props) {
    return (
        <div className={`${styles.professionPickerItem} ${(active) ? styles.active : ""}`} onClick={onClick}>
            <div className={styles.imageSection}>
                <Icon imageName={image} fontSize='1em' height='100%'></Icon>
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