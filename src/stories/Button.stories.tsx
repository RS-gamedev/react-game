import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from '../components/Button/Button';
import { resources } from '../config/Resources';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const ButtonWithIcon = Template.bind({});
ButtonWithIcon.args = {
  height: "80px",
  width: "120px",
  text: "Button with coloured icon",
  icon: ["fas","home"],
  iconColor: "red"
};
export const ActiveButton = Template.bind({});
ActiveButton.args = {
  height: "80px",
  width: "120px",
  active: true,
  text: "Active button with icon",
  icon: ["fas","home"],
  iconColor: "red"
};

export const ButtonWithImage = Template.bind({});
ButtonWithImage.args = {
  height: "80px",
  width: "120px",
  text: "Test Button",
  imageName: "villager",
  imageHeight: "50px"
};

export const ButtonWithImageAndPrices = Template.bind({});
ButtonWithImageAndPrices.args = {
  height: "80px",
  width: "120px",
  text: "Test Button",
  imageName: "villager",
  price: [
    {amount: 50,type: resources.find(x => x.name === "Wood")},
    {amount: 120,type: resources.find(x => x.name === "Stone")},
    {amount: 200,type: resources.find(x => x.name === "Coins")}
  ],
  imageHeight: "35px"
};
export const ButtonWithIconAndPrices = Template.bind({});
ButtonWithIconAndPrices.args = {
  height: "80px",
  width: "120px",
  text: "Test Button",
  price: [
    {amount: 50,type: resources.find(x => x.name === "Wood")},
    {amount: 120,type: resources.find(x => x.name === "Stone")},
    {amount: 200,type: resources.find(x => x.name === "Coins")}
  ],
  icon: ["fas","tree"],
  iconColor: "red"
};

