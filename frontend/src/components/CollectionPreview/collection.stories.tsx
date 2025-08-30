import { ComponentProps } from "react";
import { CollectionPreview } from ".";
import { Meta, StoryObj } from "@storybook/react";

type storyPropType = ComponentProps<typeof CollectionPreview>;

const meta: Meta<storyPropType> = {
    component: CollectionPreview,
};

export default meta;

type storyType = StoryObj<storyPropType>;

export const CollectionPreviewStory: storyType = {
    args: {
        collection: {
            name: "collection name",
            slug: "collection-slug",
        },
    },
    render: (args) => <CollectionPreview {...args} />,
};
