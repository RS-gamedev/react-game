import React from 'react';
import { BuildingProps } from '../../models/BuildingProps';
import styles from './UpgradeMenu.module.css';

type Props = {
    selectedBuilding: BuildingProps
}

export default function UpgradeMenu({ selectedBuilding }: Props) {
    return (
        <div className={styles.upgradeMenu}>
            <div className={styles.titleSection}>
                <span className={styles.name}>{selectedBuilding.name}</span>
                <div className={styles.levelSection}>
                    <span>{selectedBuilding.level}</span>
                </div>
            </div>

        </div>
    )
}