import { ComponentStory, ComponentMeta } from "@storybook/react";
import Settings from "../components/BuySection/BuySection";
import { shapes } from "../config/Shapes";

export default {
  title: "Components/Settings",
  component: Settings,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof Settings>;

const Template: ComponentStory<typeof Settings> = (args) => (
    <Settings {...args} />
);

export const SettingsBlock = Template.bind({});
SettingsBlock.args = {
    shapes: shapes,
    width: "240px"
};
