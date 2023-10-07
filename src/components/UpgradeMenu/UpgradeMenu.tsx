import React, { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import { useVillagers } from "../../hooks/useVillagers";
import { BuyOption } from "../../models/BuyOption";
import { Hitbox } from "../../models/Hitbox";
import { InventoryItem } from "../../models/InventoryItem";
import { Position } from "../../models/Position";
import { VillagerProfession } from "../../models/VillagerProfession";
import { Status } from "../../models/enums/Status";
import { getHitBoxCenter } from "../../utils/HitboxUtils";
import Icon from "../Icon/Icon";
import ProfessionPicker from "../ProfessionPicker/ProfessionPicker";
import ResourceItem from "../Resources/ResourceItem/ResourceItem";
import styles from "./UpgradeMenu.module.css";
import UpgradeMenuItem from "./UpgradeMenuItem";
import { useBuildings } from "../../hooks/useBuildings";
import { useMapObjects } from "../../hooks/useMapObjects";

type NeededProps = {
  buyOptions: BuyOption[];
  name: string;
  inStock: InventoryItem[];
  height: string;
  // onPlaceBuilding?: (buyOption: BuyOption, centerPosition: Position) => void;
  // onProfessionChange?: (villagerProfessions: VillagerProfession[], villagerId: string) => void;
  entityId: string;
  selectedEntityHitbox: Hitbox;
  status: Status;
  villagerProfessions?: VillagerProfession[];
};

const UpgradeMenu = React.memo(
  ({
    buyOptions,
    height,
    inStock,
    name,
    selectedEntityHitbox,
    status,
    entityId,
    // onPlaceBuilding,
    // onProfessionChange,
    villagerProfessions,
  }: NeededProps) => {
    const { trainVillager } = useVillagers();
    const [jobSelectionOpen, setJobSelectionOpen] = useState(false);
    const activeProfession = villagerProfessions ? villagerProfessions.find((x) => x.active) : undefined;
    // useEffect(() => {
    //   setPosition((x) => getHitBoxCenter(objectHitbox));
    // }, [objectHitbox]);

    // const executeBuildingOption = useCallback(
    //   (buildingOption: BuyOption) => {
    //     if (buildingOption.type === BuildingOptionType.TRAIN) {
    //       let entity = buildingOption.toExecute(position);
    //       if (onTrain) onTrain(entity);
    //     }
    //     if (buildingOption.type === BuildingOptionType.BUILD) {
    //       if (onPlaceBuilding) onPlaceBuilding(buildingOption, getHitBoxCenter(objectHitbox));
    //     }
    //     if (buildingOption.type === BuildingOptionType.UPGRADE) {
    //     }
    //   },
    //   [objectHitbox, onPlaceBuilding, onTrain, position]
    // );
    const handleClick = (e: SyntheticEvent, buyOption: BuyOption) => {
      switch (buyOption.type) {
        case "TRAIN_VILLAGER":
          trainVillager({ x: selectedEntityHitbox.leftTop.x, y: selectedEntityHitbox.leftTop.y });
          break;
        default:
          break;
      }
    };

    // const handleChangeProfession = useCallback(
    //   (villagerProfession: VillagerProfession) => {
    //     if (!onProfessionChange || !villagerProfessions) return;
    //     onProfessionChange(
    //       villagerProfessions?.map((x) => {
    //         return { ...x, active: x.id === villagerProfession.id ? true : false };
    //       }),
    //       entityId
    //     );
    //     setJobSelectionOpen(false);
    //   },
    //   [entityId, onProfessionChange, villagerProfessions]
    // );

    return (
      <div className={styles.upgradeMenu} style={{ height: height }}>
        <div className={`${styles.titleSection} ${jobSelectionOpen && styles.noTopRightBorderRadius}`}>
          <div className={styles.titlePart}>
            <span>{name}</span>
            {status !== Status.NONE && <span style={{ fontSize: "0.8em" }}>{Status[status]}</span>}
          </div>

          {villagerProfessions ? (
            <div className={`${styles.levelSection}`} onClick={() => setJobSelectionOpen((prev) => !prev)}>
              {activeProfession?.profession.name !== "None" ? (
                <CircularProgressbarWithChildren
                  className={`${styles.spinner} ${activeProfession?.currentLevel.nextLevel === "" && styles.maxLevel}`}
                  value={activeProfession?.currentExperience!}
                  maxValue={activeProfession?.currentLevel.experienceNeededForNextLevel}
                  styles={buildStyles({ pathColor: "#515b80", trailColor: "#e0e0e0" })}
                >
                  <Icon fontSize={"1em"} imageName={activeProfession?.profession.image} height={"25px"}></Icon>
                  <span>{`Level ${activeProfession?.currentLevel.level}`}</span>
                </CircularProgressbarWithChildren>
              ) : (
                <Icon fontSize={"1em"} imageName={activeProfession?.profession.image} height={"1em"}></Icon>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className={styles.buyOptionsSection}>
          {buyOptions?.map((buyOption) => (
            <UpgradeMenuItem key={buyOption.id} onClick={(e: SyntheticEvent) => handleClick(e, buyOption)} buyOption={buyOption} />
          ))}
        </div>
        <div className={styles.inventorySection}>
          {inStock ? (
            inStock.map((x, index) => {
              return (
                <ResourceItem
                  key={index}
                  resource={x.resource}
                  amount={Math.round(x.amount)}
                  iconSize="1em"
                  textSize="1em"
                  height={"100%"}
                  width={"60px"}
                  textColor="#ffffff"
                  iconHeight={"1em"}
                ></ResourceItem>
              );
            })
          ) : (
            <></>
          )}
        </div>
        {/* {villagerProfessions ? (
          <ProfessionPicker villagerProfessions={villagerProfessions} open={jobSelectionOpen} onClick={handleChangeProfession}></ProfessionPicker>
        ) : (
          <></>
        )} */}
      </div>
    );
  }
);
export default UpgradeMenu;
