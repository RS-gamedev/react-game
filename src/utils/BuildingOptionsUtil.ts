import { Position } from "../models/Position";
import { VillagerProps } from "../models/VillagerProps";
import { v4 as uuidv4 } from "uuid";
import { Status } from "../models/enums/Status";
import { resources } from "../config/Resources";
import { professions } from "../config/Professions";
import { VillagerProfession } from "../models/VillagerProfession";
import { levels } from "../config/Levels";
import { buildingOptions } from "../config/BuildingOptions";

export function trainVillager(position: Position) {
  let villagerProfessions: VillagerProfession[] = professions.map((x, index) => {
    return {
      id: uuidv4(),
      profession: x,
      currentExperience: 0,
      currentLevel: levels[0],
      active: index > 0 ? false : true,
      characterImageName: x.characterImageName,
    };
  });

  let newVillager: VillagerProps = {
    selected: false,
    currentTask: undefined,
    id: uuidv4(),
    inventoryItems: [],
    inventorySlots: 10,
    name: "Villager",
    status: Status.IDLE,
    buildingOptions: [
      buildingOptions.find(x => x.name === "Build House")!,
      buildingOptions.find(x => x.name === "Build Town Center")!,
      buildingOptions.find(x => x.name === "Build Mill")!,
      buildingOptions.find(x => x.name === "Build Storage")!
    ],
    price: [{ type: resources.find((x) => x.name === "Wood"), amount: 100 }],
    size: {
      width: 35,
      height: 35,
    },
    hitBox: {
      leftTop: {
        x: position.x - 25,
        y: position.y - 25,
      },
      rightBottom: {
        x: position.x + 25,
        y: position.y + 25,
      },
    },
    professions: villagerProfessions,
  };
  return newVillager;
}
