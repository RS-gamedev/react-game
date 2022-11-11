import Button from '../Button/Button';
import styles from './Settings.module.css';

type Props = {
    shapes: Shape[],
    onClick: (shape: Shape) => void
}

type Shape = {
    name: string,
    image: string,
    selected: boolean
}


export default function Settings({shapes, onClick}: Props) {
    return (
        <div className={styles.settingsBox}>
            <h3 style={{ margin: 0 }}>Instellingen</h3>
            <div className={styles.shapePicker}>
                {
                    shapes.map(option => {
                        return <Button active={option.selected} disabled={false} text={option.name} onClick={() => onClick(option)} width="80px" height='60px'></Button>
                    })
                }
            </div>
        </div>
    )
}