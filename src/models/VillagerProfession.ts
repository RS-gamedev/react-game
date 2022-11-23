import { VillagerType } from "./enums/VillagerType";
import { Level } from "./Level";
import { Profession } from "./Profession";

export type VillagerProfession = {
    id: string;
    profession: Profession;
    currentExperience: number;
    currentLevel: Level;
    active: boolean;
}