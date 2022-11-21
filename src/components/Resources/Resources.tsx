import React, { useEffect } from 'react';
import { Inventory } from '../../models/Inventory';
import { InventoryItem } from '../../models/InventoryItem';
import { Resource } from '../../models/Resource';
import ResourceItem from './ResourceItem/ResourceItem';
import styles from './Resources.module.css';
type Props = {
    inventory: Inventory
}

 const Resources = React.memo(({ inventory }: Props) => {
    console.log("Rendered resources");
    return (
        <div className={styles.resources}>
            {inventory.resources.map((item, index) => {
                return <ResourceItem key={index} resource={item.resource} amount={item.amount} iconSize='2em' textSize='1em' textColor='#000000' ></ResourceItem>
            })
            }
        </div>
    )
})

export default Resources;