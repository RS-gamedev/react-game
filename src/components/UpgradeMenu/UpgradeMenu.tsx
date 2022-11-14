import React, { useEffect, useState } from 'react';
import { BuildingOption } from '../../models/BuildingOption';
import { BuildingProps } from '../../models/BuildingProps';
import { Status } from '../../models/enums/Status';
import { VillagerType } from '../../models/enums/VillagerType';
import { ObjectProps } from '../../models/ObjectProps';
import { Position } from '../../models/Position';
import { VillagerProps } from '../../models/VillagerProps';
import Button from '../Button/Button';
import ResourceItem from '../Resources/ResourceItem/ResourceItem';
import styles from './UpgradeMenu.module.css';

type Props = {
    selectedBuilding: BuildingProps | undefined;
    selectedVillager: VillagerProps | undefined;
    selectedMapObject: ObjectProps | undefined;
    onTrain: (villager: VillagerProps, type: VillagerType) => VillagerProps;
}

const UpgradeMenu = React.memo(({ selectedBuilding, selectedVillager, selectedMapObject, onTrain }: Props) => {
    console.log("rendered upgrade Menu");
    const [buildingOptions, setBuildingOptions] = useState<BuildingOption[]>([]);
    const [position, setPosition] = useState<Position>({x: 500, y: 500});

    useEffect(() => {
        console.log("STATUS CHAAANGE");
    },[selectedVillager?.status])

    useEffect(() => {
        if(selectedBuilding){
            setBuildingOptions(selectedBuilding.buildingOptions);
            setPosition(selectedBuilding.position);
        }
        if(selectedVillager){
            setBuildingOptions(selectedVillager.buildingOptions);
            setPosition(selectedVillager.position);
        }
        if(selectedMapObject){
            setBuildingOptions(selectedMapObject.buildingOptions);
            setPosition(selectedMapObject.position);
        }
    }, []);

    useEffect(() => {
        console.log(selectedVillager);
    }, [selectedVillager])

    function executeBuildingOption(buildingOption: BuildingOption, type: string){
        if(type == 'train'){
            console.log("executing");
            let entity = buildingOption.toExecute(position);
            onTrain(entity, buildingOption.type!);
        }
    }

    if (selectedBuilding) {
        return <div className={styles.upgradeMenu}>
            <div className={styles.titleSection}>
                <span className={styles.name}>{selectedBuilding.name}</span>
                <div className={styles.levelSection}>
                    <span>{selectedBuilding.level}</span>
                </div>
            </div>
            <div className={styles.buildingOptionsSection} style={{ height: 'calc(100% - 80px)' }}>
                {buildingOptions.map(x => {
                    console.log(x);
                    return <Button icon={x.icon} active={false} disabled={false} height='75px' width='75px' onClick={() => executeBuildingOption(x, 'train')} text={x.name}></Button>
                })}
            </div>
        </div>
    }

    if (selectedVillager) {
        return <div className={styles.upgradeMenu}>
            <div className={styles.titleSection}>
                <div className={styles.titlePart}>
                    <span className={styles.name}>{selectedVillager.name}</span>
                    <span style={{fontSize: '1em'}}>{Status[selectedVillager.status]}</span>
                </div>

                <div className={styles.levelSection}>
                </div>
            </div>

            <div className={styles.buildingOptionsSection}>
            </div>
            <div className={styles.inventorySection}>
                {selectedVillager.inventoryItems.map(x => {
                    return <ResourceItem resource={x.resource} amount={Math.round(x.amount)} iconSize='1em' textSize='1em' textColor='#ffffff'></ResourceItem>
                })}
            </div>
        </div>
    }

    if (selectedMapObject) {
        return <div className={styles.upgradeMenu}>
            <div className={styles.titleSection}>
                <span className={styles.name}>{selectedMapObject.name}</span>
                <div className={styles.levelSection}>
                </div>
            </div>

            <div className={styles.buildingOptionsSection}>
            </div>
        </div>
    }
    return <></>
})

export default UpgradeMenu;