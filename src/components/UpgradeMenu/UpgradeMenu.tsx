import { useCallback, useEffect, useState } from "react";
import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import { BuildingOption } from "../../models/BuildingOption";
import { BuildingOptionType } from "../../models/enums/BuildingOptionType";
import { Status } from "../../models/enums/Status";
import { Hitbox } from "../../models/Hitbox";
import { InventoryItem } from "../../models/InventoryItem";
import { Position } from "../../models/Position";
import { VillagerProfession } from "../../models/VillagerProfession";
import { VillagerProps } from "../../models/VillagerProps";
import { getHitBoxCenter } from "../../utils/HitboxUtils";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import ProfessionPicker from "../ProfessionPicker/ProfessionPicker";
import ResourceItem from "../Resources/ResourceItem/ResourceItem";
import styles from "./UpgradeMenu.module.css";

type NeededProps = {
  buildingOptions: BuildingOption[];
  name: string;
  inStock: InventoryItem[];
  objectHitbox: Hitbox;
  children: any;
  height: string;
  onTrain?: (villager: VillagerProps) => VillagerProps;
  onPlaceBuilding?: (buildingOption: BuildingOption, centerPosition: Position, villagerId: string) => void;
  onProfessionChange?: (villagerProfessions: VillagerProfession[], villagerId: string) => void;
  objectId: string;
  status: Status;
  villagerProfessions?: VillagerProfession[];
};

const UpgradeMenu = ({
  buildingOptions,
  height,
  inStock,
  name,
  objectHitbox,
  status,
  onPlaceBuilding,
  onProfessionChange,
  onTrain,
  villagerProfessions,
  objectId,
  children,
}: NeededProps) => {
  const [position, setPosition] = useState<Position>({ x: 500, y: 500 });
  const [jobSelectionOpen, setJobSelectionOpen] = useState(false);
  const activeProfession = villagerProfessions ? villagerProfessions.find((x) => x.active) : undefined;

  useEffect(() => {
    setPosition((x) => getHitBoxCenter(objectHitbox));
  }, [objectHitbox]);

  const executeBuildingOption = useCallback(
    (buildingOption: BuildingOption) => {
      if (buildingOption.type === BuildingOptionType.TRAIN) {
        let entity = buildingOption.toExecute(position);
        if (onTrain) onTrain(entity);
      }
      if (buildingOption.type === BuildingOptionType.BUILD) {
        if (onPlaceBuilding) onPlaceBuilding(buildingOption, getHitBoxCenter(objectHitbox), objectId!);
      }
      if (buildingOption.type === BuildingOptionType.UPGRADE) {
      }
    },
    [objectHitbox, onPlaceBuilding, onTrain, position]
  );

  const handleChangeProfession = useCallback(
    (villagerProfession: VillagerProfession) => {
      if (!onProfessionChange || !villagerProfessions) return;
      onProfessionChange(
        villagerProfessions?.map((x) => {
          return { ...x, active: x.id === villagerProfession.id ? true : false };
        }),
        objectId
      );
      setJobSelectionOpen(false);
    },
    [objectId, onProfessionChange, villagerProfessions]
  );

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
              <Icon fontSize={"1em"} imageName={activeProfession?.profession.image} height={"50px"}></Icon>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className={styles.buildingOptionsSection}>
        <div className={styles.buildingOptionsWrapper}>
          {buildingOptions.map((x) => {
            return (
              <Button
                imageHeight={"35px"}
                imageName={x.imageName!}
                key={x.id}
                icon={x.icon}
                active={false}
                disabled={false}
                price={x.price}
                iconColor={"#ffffff"}
                height="100px"
                width="100px"
                onClick={() => executeBuildingOption(x)}
                text={x.name}
              ></Button>
            );
          })}
        </div>
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
                textColor="#ffffff"
                height={60}
                iconHeight={"80%"}
                width={60}
              ></ResourceItem>
            );
          })
        ) : (
          <></>
        )}
      </div>
      {villagerProfessions ? (
        <ProfessionPicker villagerProfessions={villagerProfessions} open={jobSelectionOpen} onClick={handleChangeProfession}></ProfessionPicker>
      ) : (
        <></>
      )}
    </div>
  );
};
export default UpgradeMenu;
