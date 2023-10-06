import { ComponentStory, ComponentMeta } from "@storybook/react";
import UpgradeMenu from "../../components/UpgradeMenu/UpgradeMenu";
import { levels } from "../../config/Levels";
import { professions } from "../../config/Professions";
import { resources } from "../../config/Resources";
import { Status } from "../../models/enums/Status";
export default {
  title: "Components/UpgradeMenu",
  component: UpgradeMenu,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof UpgradeMenu>;

const Template: ComponentStory<typeof UpgradeMenu> = (args) => <UpgradeMenu {...args} />;

export const VillagerMenu = Template.bind({});
VillagerMenu.args = {
  buyOptions: [],
  objectHitbox: { leftTop: { x: 10, y: 10 }, rightBottom: { x: 50, y: 50 } },
  villagerProfessions: professions.map((x) => {
    return { active: x.characterImageName === "lumberjack" ? true : false, id: x.id, currentExperience: 0, currentLevel: levels[0], profession: x };
  }),
  name: "Villager",
  status: Status.IDLE,
  height: "400px",
  inStock: [{amount: 8, resource: resources.find(x => x.name === "Wood")!}]
};

export const VillagerMultipleResources = Template.bind({});
VillagerMultipleResources.args = {
  buyOptions: [],
  objectHitbox: { leftTop: { x: 10, y: 10 }, rightBottom: { x: 50, y: 50 } },
  villagerProfessions: professions.map((x) => {
    return { active: x.characterImageName === "lumberjack" ? true : false, id: x.id, currentExperience: 0, currentLevel: levels[0], profession: x };
  }),
  name: "Villager",
  status: Status.IDLE,
  height: "400px",
  inStock: [{amount: 8, resource: resources.find(x => x.name === "Wood")!}, {amount: 8, resource: resources.find(x => x.name === "Stone")!}, {amount: 8, resource: resources.find(x => x.name === "Food")!}]
};

export const BuildingMenu = Template.bind({});
BuildingMenu.args = {
  buyOptions: [],
  objectHitbox: { leftTop: { x: 10, y: 10 }, rightBottom: { x: 50, y: 50 } },
  name: "Town Center",
  status: Status.NONE,
  height: "400px",
};

export const MapObjectMenu = Template.bind({});
MapObjectMenu.args = {
  buyOptions: [],
  objectHitbox: { leftTop: { x: 10, y: 10 }, rightBottom: { x: 50, y: 50 } },
  name: "Tree",
  status: Status.NONE,
  height: "400px",
  inStock: [{amount: 50, resource: resources.find(x => x.name === "Wood")!}]
};
