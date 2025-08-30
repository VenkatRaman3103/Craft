import { ComponentProps } from "react";
import { PagePreview } from ".";
import { Meta, StoryObj } from "@storybook/react";

type StoryPropsType = ComponentProps<typeof PagePreview>;

// meta
const meta: Meta<StoryPropsType> = {
    argTypes: {
        name: {
            control: "text",
        },
        slug: {
            control: "text",
        },
        description: {
            control: "text",
        },
    },
};

export default meta;

// stories
type StoryType = StoryObj<StoryPropsType>;

export const PagesPreviewStory: StoryType = {
    args: {
        name: "page title",
        slug: "page-slug",
        description:
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit.Provident accusamus dolorem eligendi odio, pariatur, sed, beatae similique magni necessitatibus id saepe ullam eius porro autem amet perspiciatis sit repellat non?",
    },
    render: (args) => <PagePreview {...args} />,
};
