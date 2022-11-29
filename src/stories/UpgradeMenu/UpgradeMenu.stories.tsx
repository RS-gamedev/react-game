import { ComponentStory, ComponentMeta } from "@storybook/react";
import UpgradeMenu from "../../components/UpgradeMenu/UpgradeMenu";
import { levels } from "../../config/Levels";
import { professions } from "../../config/Professions";
import { BuildingProps } from "../../models/BuildingProps";
import { BuildingType } from "../../models/enums/BuildingType";
import { Status } from "../../models/enums/Status";
import { VillagerProps } from "../../models/VillagerProps";
export default {
  title: "Components/UpgradeMenu",
  component: UpgradeMenu,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof UpgradeMenu>;

const Template: ComponentStory<typeof UpgradeMenu> = (args) => <UpgradeMenu {...args} />;

const testVillager: VillagerProps = {
  id: "1",
  buildingOptions: [],
  hitBox: { leftTop: { x: 10, y: 10 }, rightBottom: { x: 50, y: 50 } },
  inventorySlots: 10,
  inventoryItems: [],
  name: "villager",
  price: [],
  professions: professions.map((x) => {
    return { active: x.characterImageName === "villager" ? true : false, id: x.id, currentExperience: 0, currentLevel: levels[0], profession: x };
  }),
  selected: false,
  size: { height: 50, width: 50 },
  status: Status.IDLE,
  currentTask: undefined,
  goalObjectId: undefined,
};

const testBuilding: BuildingProps = {
  id: "building-1",
  buildingOptions: [],
  hitBox: { leftTop: { x: 10, y: 10 }, rightBottom: { x: 50, y: 50 } },
  inventory: [],
  image: "townCenter",
  level: 0,
  price: [],
  type: BuildingType.TOWN_CENTER,
  name: "Town Center",
  color: "red",
  selected: false,
  size: { height: 50, width: 50 },
  position: { x: 50, y: 50 },
};

export const VillagerMenu = Template.bind({});
VillagerMenu.args = {
  selectedVillager: testVillager,
  height: "400px",
};

export const BuildingMenu = Template.bind({});
BuildingMenu.args = {
  selectedBuilding: testBuilding,
  height: "400px",
};
