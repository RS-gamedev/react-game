import { ComponentStory, ComponentMeta } from "@storybook/react";
import Villager from "../components/Villager/Villager";
import { levels } from "../config/Levels";
import { professions } from "../config/Professions";
export default {
  title: "Components/Villager",
  component: Villager,
  argTypes: {
  },
} as ComponentMeta<typeof Villager>;

const Template: ComponentStory<typeof Villager> = (args) => <Villager {...args} />;
export const Lumberjack = Template.bind({});
Lumberjack.args = {
  hitBox: { leftTop: { x: 10, y: 10 }, rightBottom: { x: 50, y: 50 } },
  size: { width: 50, height: 50 },
  professions: professions.map((x) => {
    return { active: x.characterImageName === "lumberjack" ? true : false, id: x.id, currentExperience: 0, currentLevel: levels[0], profession: x };
  }),
  selected: false,
};
Lumberjack.parameters = {
  backgrounds: {
    default: "light",
  },
};

export const Miner = Template.bind({});
Miner.args = {
  hitBox: { leftTop: { x: 10, y: 10 }, rightBottom: { x: 50, y: 50 } },
  size: { width: 50, height: 50 },
  professions: professions.map((x) => {
    return { active: x.characterImageName === "miner" ? true : false, id: x.id, currentExperience: 0, currentLevel: levels[0], profession: x };
  }),
  selected: false,
};
Miner.parameters = {
    backgrounds: {
      default: "light",
    },
  };
  
export const Farmer = Template.bind({});
Farmer.args = {
  hitBox: { leftTop: { x: 10, y: 10 }, rightBottom: { x: 50, y: 50 } },
  size: { width: 50, height: 50 },
  professions: professions.map((x) => {
    return { active: x.characterImageName === "farmer" ? true : false, id: x.id, currentExperience: 0, currentLevel: levels[0], profession: x };
  }),
  selected: false,
};
Farmer.parameters = {
    backgrounds: {
      default: "light",
    },
  };
  
