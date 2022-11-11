import { VillagerProps } from '../../models/VillagerProps';
import { getImageUrl } from '../../utils/MapUtils';
import styles from './Villager.module.css';

export default function Villager({id, name, position}: VillagerProps) {
  return (
    <div className={styles.villager} style={{left: position.x, top: position.y}}>
        <img style={{height:'100%'}}src={getImageUrl('villager')}></img>
    </div>
  )
}