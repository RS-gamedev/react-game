import { ComponentStory, ComponentMeta } from "@storybook/react";
import Building from "../components/Building/Building";
export default {
  title: "Components/Building",
  component: Building,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof Building>;

const Template: ComponentStory<typeof Building> = (args) => <Building {...args} />;

export const TownCenter = Template.bind({});
TownCenter.args = {
  hitBox: { leftTop: { x: 10, y: 10 }, rightBottom: { x: 50, y: 50 } },
  size: { width: 75, height: 75 },
  image: "townCenter",
};
TownCenter.parameters = {
  backgrounds: {
    default: "light",
  },
};

export const SelectedTownCenter = Template.bind({});
SelectedTownCenter.args = {
  hitBox: { leftTop: { x: 10, y: 10 }, rightBottom: { x: 50, y: 50 } },
  size: { width: 75, height: 75 },
  image: "townCenter",
  selected: true,
};
SelectedTownCenter.parameters = {
  backgrounds: {
    default: "light",
  },
};
