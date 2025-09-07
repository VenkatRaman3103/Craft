import { ComponentProps } from "react";
import { CollectionPreview } from ".";
import { Meta, StoryObj } from "@storybook/react";
// bar

type storyPropType = ComponentProps<typeof CollectionPreview>;

const meta: Meta<storyPropType> = {
    component: CollectionPreview,
    argTypes: {
        name: {
            control: "text",
        },
        slug: {
            control: "text",
        },
    },
};

export default meta;

type storyType = StoryObj<storyPropType>;

export const CollectionPreviewStory: storyType = {
    args: {
        name: "collection name",
        slug: "collection-slug",
    },
    render: (args) => <CollectionPreview {...args} />,
};
