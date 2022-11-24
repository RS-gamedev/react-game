import { Profession } from "../models/Profession";
import { v4 as uuidv4 } from "uuid";
import { levels } from "./Levels";

export const professions: Profession[] = [
  {
    id: uuidv4(),
    name: "None",
    image: "none",
    maxLevel: levels.find((level) => level.level === 5)!,
    characterImageName: "villager",
  },
  {
    id: uuidv4(),
    name: "Lumberjack",
    image: "axe",
    maxLevel: levels.find((level) => level.level === 5)!,
    characterImageName: "lumberjack",
  },
  {
    id: uuidv4(),
    name: "Farmer",
    image: "hoe",
    maxLevel: levels.find((level) => level.level === 5)!,
    characterImageName: "farmer",
  },
  {
    id: uuidv4(),
    name: "Miner",
    image: "pickaxe",
    maxLevel: levels.find((level) => level.level === 5)!,
    characterImageName: "miner",
  },
];
