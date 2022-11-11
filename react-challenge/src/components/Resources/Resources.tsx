import { InventoryItem } from '../../models/InventoryItem';
import { Resource } from '../../models/Resource';
import ResourceItem from './ResourceItem/ResourceItem';
import styles from './Resources.module.css';
type Props = {
    resources: InventoryItem[]
}

export default function Resources({ resources }: Props) {
    return (
        <div className={styles.resources}>
            {resources.map((item, index) => {
                return <ResourceItem key={index} resource={item.resource} amount={item.amount} ></ResourceItem>
            })
            }
        </div>
    )
}