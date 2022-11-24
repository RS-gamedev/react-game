import { Level } from "../models/Level";
import { v4 as uuidv4 } from "uuid";

export const levels: Level[] = [
  {
    id: "level-1",
    level: 1,
    experienceNeededForNextLevel: 500,
    nextLevel: "level-2",
  },
  {
    id: "level-2",
    level: 2,
    experienceNeededForNextLevel: 750,
    nextLevel: "level-3",
  },
  {
    id: "level-3",
    level: 3,
    experienceNeededForNextLevel: 1000,
    nextLevel: "level-4",
  },
  {
    id: "level-4",
    level: 4,
    experienceNeededForNextLevel: 1250,
    nextLevel: "level-5",
  },
  {
    id: "level-5",
    level: 5,
    experienceNeededForNextLevel: 999999,
    nextLevel: "",
  },
];
