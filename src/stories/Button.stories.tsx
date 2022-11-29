import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from '../components/Button/Button';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const ButtonWithIcon = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ButtonWithIcon.args = {
  height: "80px",
  width: "120px",
  text: "Button with coloured icon",
  icon: ["fas","home"],
  iconColor: "red"
};

export const ButtonWithImage = Template.bind({});
ButtonWithImage.args = {
  height: "40px",
  width: "80px",
  text: "Test Button",
  imageName: "villager",
};