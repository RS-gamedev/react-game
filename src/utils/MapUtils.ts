import tree from "../assets/tree.svg";
import villager from "../assets/villager.svg";
import townCenter from "../assets/townCenter4.svg";
import axe from "../assets/axe.svg";
import none from "../assets/none.svg";
import lumberjack from "../assets/lumberjack.svg";
import farmer from "../assets/farmer.svg";
import hoe from "../assets/hoe.svg";
import house from "../assets/house4.svg";
import logs from "../assets/logs.svg";
import food from "../assets/food.svg";
import mill from "../assets/mill.svg";
import field from "../assets/field2.svg";
import storage from "../assets/storage.svg";
import stone from "../assets/stone.svg";
import rock from "../assets/rock.svg";
import miner from "../assets/miner2.svg";
import pickaxe from "../assets/pickaxe.svg";
import { MapPickerObject } from "../models/MapPickerObject";

export const getImageUrl = (name: string) => {
  switch (name) {
    case "tree":
      return tree;
    case "field":
      return field;
    case "villager":
      return villager;
    case "townCenter":
      return townCenter;
    case "axe":
      return axe;
    case "pickaxe":
      return pickaxe;
    case "hoe":
      return hoe;
    case "none":
      return none;
    case "lumberjack":
      return lumberjack;
    case "farmer":
      return farmer;
    case "house":
      return house;
    case "logs":
      return logs;
    case "food":
      return food;
    case "rock":
      return rock;
    case "stone":
      return stone;
    case "mill":
      return mill;
    case "storage":
      return storage;
    case "miner":
      return miner;
    default:
      return tree;
  }
};

export const generateMap = (width: number, treeAmount: number, stoneAmount: number): MapPickerObject[] => {
  // const f = (x: number) => (Math.sin(x) * 10000) & 255;
  const generateCoordinate = (x: number) => {
    return Math.random() * width;
  };
  let newPositions: MapPickerObject[] = [];
  for (let i = 0; i < treeAmount; i++) {
    let object = {
      name: "tree",
      size: 40,
      position: { x: generateCoordinate(Math.random()), y: generateCoordinate(Math.random()) },
      previewSize: {
        width: 10,
        height: 10,
      },
      color: "green",
    };
    if (
      (object.position.x > 350 || object.position.y > 100) &&
      object.position.x > 10 &&
      object.position.y > 10 &&
      object.position.x < width - 10 &&
      object.position.y < width - 10
    ) {
      if (
        object.position.x > width / 2 + 100 ||
        object.position.x < width / 2 - 100 ||
        object.position.y > width / 2 + 100 ||
        object.position.y < width / 2 - 100
      ) {
        newPositions.push(object);
      }
    }
  }
  for (let i = 0; i < stoneAmount; i++) {
    let stone = {
      name: "rock",
      size: 40,
      position: { x: generateCoordinate(i), y: generateCoordinate(Math.random()) },
      previewSize: {
        width: 10,
        height: 10,
      },
      color: "grey",
    };
    if (
      (stone.position.x > 350 || stone.position.y > 100) &&
      stone.position.x > 10 &&
      stone.position.y > 10 &&
      stone.position.x < width - 10 &&
      stone.position.y < width - 10
    ) {
      if (
        stone.position.x > width / 2 + 100 ||
        stone.position.x < width / 2 - 100 ||
        stone.position.y > width / 2 + 100 ||
        stone.position.y < width / 2 - 100
      ) {
        newPositions.push(stone);
      }
    }
  }

  return newPositions;
};
