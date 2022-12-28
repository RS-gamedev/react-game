import { BuildingOption } from "../models/BuildingOption";
import { v4 as uuidv4 } from "uuid";
import { resources } from "./Resources";
import { Position } from "../models/Position";
import { trainVillager } from "../utils/BuildingOptionsUtil";
import { BuildingOptionType } from "../models/enums/BuildingOptionType";

export const buildingOptions: BuildingOption[] = [
  {
    id: uuidv4(),
    name: "Train Villager",
    toExecute: trainVillager,
    price: [{ type: resources.find((x) => x.name === "Wood"), amount: 100 }],
    imageName: "villager",
    type: BuildingOptionType.TRAIN,
  },
  {
    id: uuidv4(),
    name: "Upgrade Town center",
    icon: ["fas", "coins"],
    toExecute: (position: Position) => { },
    price: [{ type: resources.find((x) => x.name === "Coins"), amount: 100 }],
    imageName: "none",
    type: BuildingOptionType.UPGRADE,
  },
  {
    id: uuidv4(),
    name: "Upgade Villagers",
    icon: ["fas", "gem"],
    toExecute: (position: Position) => { },
    price: [{ type: resources.find((x) => x.name === "Gem"), amount: 100 }],
    imageName: "none",
    type: BuildingOptionType.BUILD,
  },
  {
    id: uuidv4(),
    name: "Place field",
    toExecute: (position: Position) => { },
    imageName: "field",
    type: BuildingOptionType.BUILD,
    price: [{ type: resources.find((x) => x.name === "Wood"), amount: 25 }],
    shapeId: "farm-field",
    placementRange: 50,
  },
  {
    id: uuidv4(),
    name: "Build House",
    toExecute: (position: Position) => { },
    imageName: "house",
    type: BuildingOptionType.BUILD,
    price: [{ type: resources.find((x) => x.name === "Wood"), amount: 100 }, { type: resources.find(x => x.name === "Coins"), amount: 50 }],
    shapeId: "house",
    placementRange: 0
  },
  {
    id: uuidv4(),
    name: "Build Town Center",
    toExecute: (position: Position) => { },
    imageName: "townCenter",
    type: BuildingOptionType.BUILD,
    price: [{ type: resources.find((x) => x.name === "Wood"), amount: 100 }, { type: resources.find(x => x.name === "Coins"), amount: 250 }, { type: resources.find(x => x.name === "Stone"), amount: 100 }],
    shapeId: "town-center",
    placementRange: 0
  },
  {
    id: uuidv4(),
    name: "Build Mill",
    toExecute: (position: Position) => { },
    imageName: "mill",
    type: BuildingOptionType.BUILD,
    price: [{ type: resources.find((x) => x.name === "Wood"), amount: 50 }],
    shapeId: "mill",
    placementRange: 0
  },
  {
    id: uuidv4(),
    name: "Build Storage",
    toExecute: (position: Position) => { },
    imageName: "storage",
    type: BuildingOptionType.BUILD,
    price: [{ type: resources.find((x) => x.name === "Coins"), amount: 50 }],
    shapeId: "storage",
    placementRange: 0
  },
];
