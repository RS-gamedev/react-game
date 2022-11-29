import { ComponentStory, ComponentMeta } from '@storybook/react';
import PlacementOverlay from '../components/PlacementOverlay/PlacementOverlay';

export default {
  title: 'Components/PlacementOverlay',
  component: PlacementOverlay,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof PlacementOverlay>;

const Template: ComponentStory<typeof PlacementOverlay> = (args) => <PlacementOverlay {...args} />;

export const FullScreen = Template.bind({});
FullScreen.args = {
    fullscreen: true
}
FullScreen.parameters = {
    backgrounds: {
      default: "light",
    },
  };
  
export const LocalCircle = Template.bind({});
LocalCircle.args = {
    fullscreen: false,
    centerPosition: {x: 100, y: 100},
    circle: true,
    size: {height: 100, width: 100}
}
LocalCircle.parameters = {
    backgrounds: {
      default: "light",
    },
  };
  

export const LocalSquare = Template.bind({});
LocalSquare.args = {
    fullscreen: false,
    centerPosition: {x: 100, y: 100},
    circle: false,
    size: {height: 100, width: 100}
}
LocalSquare.parameters = {
    backgrounds: {
      default: "light",
    },
  };
  