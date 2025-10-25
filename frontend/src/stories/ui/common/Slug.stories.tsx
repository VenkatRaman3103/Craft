import { ComponentProps } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Slug } from "@/components/ui/common/Slug";

type StoryPropsType = ComponentProps<typeof Slug>;

const meta: Meta<StoryPropsType> = {
    component: Slug,
};

export default meta;

type StoryType = StoryObj<StoryPropsType>;

export const ComponentStory: StoryType = {
    args: {
        slug: "some-slug",
    },
    render: (args) => <Slug {...args} />,
};
