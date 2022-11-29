import { ComponentStory, ComponentMeta } from '@storybook/react';
import MapObject from '../components/MapObject/MapObject';
import { resources } from '../config/Resources';
export default {
  title: 'Components/MapObject',
  component: MapObject,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof MapObject>;

const Template: ComponentStory<typeof MapObject> = (args) => <MapObject {...args} />;

export const FreshTree = Template.bind({});
FreshTree.args = {
    name: "tree",
    size: {height: "50px", width:"50px"},
    hitBox: {leftTop: {x: 10, y:10}, rightBottom: {x:50, y:50}},
    inventoryMax: 10,
    inventory: [{amount: 10, resource: resources.find(x => x.name === "Wood")!}],
    onClick: () => {}
};
export const SelectedTree = Template.bind({});
SelectedTree.args = {
    name: "tree",
    size: {height: "50px", width:"50px"},
    hitBox: {leftTop: {x: 10, y:10}, rightBottom: {x:50, y:50}},
    inventoryMax: 10,
    inventory: [{amount: 10, resource: resources.find(x => x.name === "Wood")!}],
    onClick: () => {},
    selected: true
    
};

export const TreeWithDepletedResources = Template.bind({});
TreeWithDepletedResources.args = {
    name: "tree",
    size: {height: "50px", width:"50px"},
    hitBox: {leftTop: {x: 10, y:10}, rightBottom: {x:50, y:50}},
    inventoryMax: 10,
    inventory: [{amount:8, resource: resources.find(x => x.name === "Wood")!}],
    onClick: () => {}

}