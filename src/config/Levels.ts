import { Level } from "../models/Level";
import { v4 as uuidv4 } from "uuid";

export const levels: Level[] = [
  {
    id: uuidv4(),
    level: 1,
    experienceNeededForNextLevel: 500,
  },
  {
    id: uuidv4(),
    level: 2,
    experienceNeededForNextLevel: 750,
  },
  {
    id: uuidv4(),
    level: 3,
    experienceNeededForNextLevel: 1000,
  },
  {
    id: uuidv4(),
    level: 4,
    experienceNeededForNextLevel: 1250,
  },
  {
    id: uuidv4(),
    level: 5,
    experienceNeededForNextLevel: 999999,
  },
];
