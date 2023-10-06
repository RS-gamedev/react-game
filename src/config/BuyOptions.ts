import { v4 as uuidv4 } from "uuid";
import { BuyOption } from "../models/BuyOption";
import { resources } from "./Resources";

export type BuyOptionIdentifier = "TRAIN_VILLAGER" | "UPGRADE_VILLAGER" | "UPGRADE_BUILDING" | "PLACE_BUILDING";

export const buyOptions: BuyOption[] = [
  {
    id: uuidv4(),
    name: "Train Villager",
    price: [{ type: resources.find((x) => x.name === "Wood"), amount: 100 }],
    imageName: "villager",
    type: "TRAIN_VILLAGER",
  },
  {
    id: uuidv4(),
    name: "Upgrade Town center",
    icon: ["fas", "coins"],
    price: [{ type: resources.find((x) => x.name === "Coins"), amount: 100 }],
    imageName: "none",
    type: "UPGRADE_BUILDING",
  },
  {
    id: uuidv4(),
    name: "Upgade Villagers",
    icon: ["fas", "gem"],
    price: [{ type: resources.find((x) => x.name === "Gem"), amount: 100 }],
    imageName: "none",
    type: "UPGRADE_VILLAGER",
  },
  {
    id: uuidv4(),
    name: "Place field",
    imageName: "field",
    type: "PLACE_BUILDING",
    price: [{ type: resources.find((x) => x.name === "Wood"), amount: 25 }],
    shapeId: "farm-field",
    placementRange: 50,
  },
];
