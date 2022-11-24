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
    case "mill":
      return mill;
    case "storage":
      return storage;
    default:
      return tree;
  }
};
