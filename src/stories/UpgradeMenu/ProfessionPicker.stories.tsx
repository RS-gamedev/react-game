import { ComponentStory, ComponentMeta } from "@storybook/react";
import ProfessionPicker from "../../components/ProfessionPicker/ProfessionPicker";
import { levels } from "../../config/Levels";
import { professions } from "../../config/Professions";

export default {
  title: "Components/UpgradeMenu/ProfessionPicker",
  component: ProfessionPicker,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof ProfessionPicker>;

const Template: ComponentStory<typeof ProfessionPicker> = (args) => (
    <ProfessionPicker {...args} />
);

export const professionPicker = Template.bind({});
professionPicker.args = {
  open: true,
  villagerProfessions: [
    {
      profession: professions[0],
      active: true,
      currentExperience: 0,
      currentLevel: levels[0],
      id: "1",
    },
    {
      profession: professions[1],
      active: false,
      currentExperience: 0,
      currentLevel: levels[0],
      id: "1",
    },
    {
      profession: professions[2],
      active: false,
      currentExperience: 0,
      currentLevel: levels[0],
      id: "1",
    },
  ],
  onClick: () => {},
};
