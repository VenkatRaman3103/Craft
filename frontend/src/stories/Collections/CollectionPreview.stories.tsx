import { ComponentProps } from "react";
import { Meta, StoryObj } from "@storybook/react";
import "@/styles/globals.css";
import { MemoryRouter } from "react-router";
import { CollectionPreview } from "@/features/Collections/components/CollectionPreview";

type StoryPropsType = ComponentProps<typeof CollectionPreview>;

const meta: Meta<StoryPropsType> = {
    component: CollectionPreview,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
};

export default meta;

type StoryType = StoryObj<StoryPropsType>;

export const CollectionPreviewStory: StoryType = {
    args: {
        name: "Collection name",
        slug: "collection-slug",
    },
    render: (args) => <CollectionPreview {...args} />,
};
