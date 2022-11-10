import Button from '../Button/Button';
import styles from './Settings.module.css';

type Props = {}

type Shape = {
    name: string,
    image: string,
    selected: boolean
}


export default function Settings({ }: Props) {

    const options: Shape[] = [
        {
            name: "Circle",
            image: "",
            selected: false
        },
        {
            name: "Square",
            image: "",
            selected: false
        },
        {
            name: "Triangle",
            image: "",
            selected: false
        }
    ]

    function selectShape(shape: Shape) {
        console.log(shape);
    }

    return (
        <div className={styles.settingsBox}>
            <h3 style={{ margin: 0 }}>Instellingen</h3>
            <div className={styles.shapePicker}>
                {
                    options.map(option => {
                        return <Button active={option.selected} disabled={false} text={option.name} onClick={() => selectShape(option)} width="80px" height='60px'></Button>
                    })
                }
            </div>
        </div>
    )
}