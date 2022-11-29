import { ComponentStory, ComponentMeta } from "@storybook/react";
import Resources from "../../components/Resources/Resources";
import { resources } from "../../config/Resources";
export default {
  title: "Components/Resources",
  component: Resources,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof Resources>;

const Template: ComponentStory<typeof Resources> = (args) => <Resources {...args} />;

export const ResourceMenu = Template.bind({});
ResourceMenu.args = {
    inventory: {resources: [
        {
            amount: 100,
            resource: resources[0]
        },
        {
            amount: 100,
            resource: resources[1]
        },
        {
            amount: 100,
            resource: resources[2]
        },
        {
            amount: 100,
            resource: resources[3]
        },
        {
            amount: 100,
            resource: resources[4]
        }
    ]},
    itemsHeight: 50
};