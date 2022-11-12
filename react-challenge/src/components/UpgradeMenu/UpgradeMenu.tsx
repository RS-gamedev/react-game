import React, { useEffect, useState } from 'react';
import { BuildingOption } from '../../models/BuildingOption';
import { BuildingProps } from '../../models/BuildingProps';
import { getBuildingOptions } from '../../utils/BuildingUtils';
import styles from './UpgradeMenu.module.css';

type Props = {
    selectedBuilding: BuildingProps
}

export default function UpgradeMenu({ selectedBuilding }: Props) {

    const [buildingOptions, setBuildingOptions] = useState<BuildingOption[]>([]);


    useEffect(() => {    
        // get building options for building.
        let x = getBuildingOptions(selectedBuilding);
        setBuildingOptions(x);
        console.log(x);
    }, [])
    

    return (
        <div className={styles.upgradeMenu}>
            <div className={styles.titleSection}>
                <span className={styles.name}>{selectedBuilding.name}</span>
                <div className={styles.levelSection}>
                    <span>{selectedBuilding.level}</span>
                </div>
            </div>
            <div className={styles.buildingOptionsSection}>
                {buildingOptions.map(x => {
                    return <div>{x.name}</div>
                })}
            </div>

        </div>
    )
}