import { SlugLabel } from "@/components/ui/SlugLabel";
import { ComponentProps } from "react";
import { Meta, StoryObj } from "@storybook/react";
import "../../index.css";

type storyPropsType = ComponentProps<typeof SlugLabel>;

// meta
const meta: Meta<storyPropsType> = {
    component: SlugLabel,
    argTypes: {
        label: {
            control: "text",
        },
    },
};

export default meta;

// story
type Story = StoryObj<storyPropsType>;

export const SlugLabelStory: Story = {
    args: {
        label: "hello world",
    },
    render: (args) => <SlugLabel {...args} />,
};
