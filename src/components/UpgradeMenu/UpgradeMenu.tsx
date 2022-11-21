import { useCallback, useEffect, useState } from 'react';
import { BuildingOption } from '../../models/BuildingOption';
import { BuildingProps } from '../../models/BuildingProps';
import { Status } from '../../models/enums/Status';
import { VillagerType } from '../../models/enums/VillagerType';
import { InventoryItem } from '../../models/InventoryItem';
import { ObjectProps } from '../../models/ObjectProps';
import { Position } from '../../models/Position';
import { VillagerProfession } from '../../models/VillagerProfession';
import { VillagerProps } from '../../models/VillagerProps';
import { getHitBoxCenter } from '../../utils/HitboxUtils';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import ProfessionPicker from '../ProfessionPicker/ProfessionPicker';
import ResourceItem from '../Resources/ResourceItem/ResourceItem';
import styles from './UpgradeMenu.module.css';

type Props = {
    selectedBuilding: BuildingProps | undefined;
    selectedVillager: VillagerProps | undefined;
    selectedMapObject: ObjectProps | undefined;
    onTrain: (villager: VillagerProps) => VillagerProps;
    inStock?: InventoryItem[],
    onProfessionChange?: (selectedVillager: VillagerProps) => void
}

const UpgradeMenu = ({ selectedBuilding, selectedVillager, selectedMapObject, onTrain, inStock, onProfessionChange }: Props) => {
    console.log("Rendered UpgradeMenu");
    const [buildingOptions, setBuildingOptions] = useState<BuildingOption[]>([]);
    const [position, setPosition] = useState<Position>({ x: 500, y: 500 });
    const [jobSelectionOpen, setJobSelectionOpen] = useState(false);

    const activeProfession = selectedVillager?.professions.find(x => x.active);

    useEffect(() => {
        if (selectedBuilding) {
            setBuildingOptions(selectedBuilding.buildingOptions);
            setPosition(getHitBoxCenter(selectedBuilding.hitBox));
        }
        if (selectedVillager) {
            setBuildingOptions(selectedVillager.buildingOptions);
            setPosition(getHitBoxCenter(selectedVillager.hitBox));
        }
        if (selectedMapObject) {
            setBuildingOptions(selectedMapObject.buildingOptions);
            setPosition(getHitBoxCenter(selectedMapObject.hitBox));
        }
    }, []);

    const executeBuildingOption = useCallback((buildingOption: BuildingOption, type: string) => {
        if (type == 'train') {
            let entity = buildingOption.toExecute(position);
            onTrain(entity);
        }
    }, [onTrain])

    const handleChangeProfession = useCallback((villagerProfession: VillagerProfession) => {
        if(!onProfessionChange || !selectedVillager) return;
        let selectedVillagerCopy = {
            ...selectedVillager, professions: selectedVillager.professions.map(x => {
                if(x.profession.id === villagerProfession.profession.id){
                    return { ...x, active: true }
                }
                return { ...x, active: false }
            })
        }
        setJobSelectionOpen(false);
        onProfessionChange(selectedVillagerCopy);
    }, [selectedVillager])

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
                    return <Button imageHeight={"50%"} imageName={x.imageName!} key={x.id} icon={x.icon} active={false} disabled={false} price={x.price} iconColor={'#ffffff'} height='100px' width='100px' onClick={() => executeBuildingOption(x, 'train')} text={x.name}></Button>
                })}
            </div>
        </div>
    }

    if (selectedVillager) {
        return <div className={styles.upgradeMenu}>
            <div className={`${styles.titleSection} ${(jobSelectionOpen) && styles.noTopRightBorderRadius}`}>
                <div className={styles.titlePart}>
                    <span className={styles.name}>{selectedVillager.name}</span>
                    <span style={{ fontSize: '1em' }}>{Status[selectedVillager.status]}</span>
                </div>

                <div className={`${styles.levelSection}`} onClick={() => setJobSelectionOpen((prev) => !prev)}>
                    <Icon fontSize={"1em"} imageName={activeProfession?.profession.image} height={"100%"}></Icon>
                </div>
            </div>

            <div className={styles.buildingOptionsSection}>
            </div>
            <div className={styles.inventorySection}>
                {(inStock) ? inStock.map(x => {
                    return <ResourceItem resource={x.resource} amount={Math.round(x.amount)} iconSize='1em' textSize='1em' textColor='#ffffff'></ResourceItem>
                }) : <></>}
            </div>
            <ProfessionPicker villagerProfessions={selectedVillager.professions} open={jobSelectionOpen} onClick={((villagerProfession) => handleChangeProfession(villagerProfession))}></ProfessionPicker>
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
            <div className={styles.inventorySection}>
                {(inStock) ? inStock.map(x => {
                    return <ResourceItem resource={x.resource} amount={Math.round(x.amount)} iconSize='1em' textSize='1em' textColor='#ffffff'></ResourceItem>
                }) : <></>}
            </div>
        </div>
    }
    return <></>
}

export default UpgradeMenu;