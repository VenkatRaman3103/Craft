import { ComponentProps } from "react";
import { ElementsTab } from ".";
import { Meta, StoryObj } from "@storybook/react";

const testData = [
    { name: "collections", slug: "collections" },
    { name: "pages", slug: "pages" },
    { name: "another-pages", slug: "another-pages" },
    { name: "foo", slug: "foo" },
];

type StoryPropsType = ComponentProps<typeof ElementsTab>;

const meta: Meta<StoryPropsType> = {
    component: ElementsTab,
    argTypes: {
        activeElement: {
            control: "radio",
            options: testData.map((_, ind) => ind),
        },
        elements: { control: "object" },
    },
};

export default meta;

type StoryType = StoryObj<StoryPropsType>;

export const ElementStory: StoryType = {
    args: {
        activeElement: 0,
        elements: [...testData],
    },
    render: (args) => {
        return <ElementsTab {...args} />;
    },
};
