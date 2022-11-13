import { useEffect, useState } from 'react';
import { BuildingOption } from '../../models/BuildingOption';
import { BuildingProps } from '../../models/BuildingProps';
import { VillagerProps } from '../../models/VillagerProps';
import { getBuildingOptions } from '../../utils/BuildingUtils';
import Button from '../Button/Button';
import ResourceItem from '../Resources/ResourceItem/ResourceItem';
import styles from './UpgradeMenu.module.css';

type Props = {
    selectedBuilding: BuildingProps | undefined,
    selectedVillager: VillagerProps | undefined,
    onAddVillager: (villager: VillagerProps) => void
}

export default function UpgradeMenu({ selectedBuilding, onAddVillager, selectedVillager }: Props) {

    const [buildingOptions, setBuildingOptions] = useState<BuildingOption[]>([]);

    useEffect(() => {
        // get building options for building.
        if (selectedBuilding) {
            let x = getBuildingOptions(selectedBuilding);
            setBuildingOptions(x);
        }
        if (selectedVillager) {

        }
    }, []);

    function trainVillager(villager: VillagerProps) {
        onAddVillager(villager);
    }

    if (selectedBuilding) {
        return <div className={styles.upgradeMenu}>
            <div className={styles.titleSection}>
                <span className={styles.name}>{selectedBuilding.name}</span>
                <div className={styles.levelSection}>
                    <span>{selectedBuilding.level}</span>
                </div>
            </div>
            <div className={styles.buildingOptionsSection} style={{height: 'calc(100% - 80px)'}}>
                {buildingOptions.map(x => {
                    return <Button icon={x.icon} active={false} disabled={false} height='75px' width='75px' onClick={() => trainVillager(x.toExecute(selectedBuilding.position))} text={x.name}></Button>
                })}
            </div>
        </div>
    }

    if (selectedVillager) {
        return <div className={styles.upgradeMenu}>
            <div className={styles.titleSection}>
                <span className={styles.name}>{selectedVillager.name}</span>
                <div className={styles.levelSection}>
                </div>
            </div>

            <div className={styles.buildingOptionsSection}>
                <span>{selectedVillager.currentTask?.toString()}</span>
            </div>
            <div className={styles.inventorySection}>
                {selectedVillager.inventoryItems.map(x => {
                    return <ResourceItem resource={x.resource} amount={Math.round(x.amount)} iconSize='1em' textSize='1em' textColor='#ffffff'></ResourceItem>
                })}
            </div>
        </div>
    }
    return <></>
}