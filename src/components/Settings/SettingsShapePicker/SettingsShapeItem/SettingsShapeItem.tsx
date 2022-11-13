import Button from '../../../Button/Button';
import styles from './SettingsShapeItem.module.css';
type Props = {
    shape: Shape
}

type Shape = {
    name: string,
    image: string,
    selected: boolean
}

export default function SettingsShapeItem({shape}: Props) {

    function onClick(){

    }

  return (
    <div className={styles.shapeToggle}>
        <span>{shape.name}</span>
        {/* <Button active={shape.selected} onClick={onClick} text=''></Button> */}
    </div>
  )
}