import { ComponentProps } from "react";
import { ElementsContent } from ".";
import { Meta, StoryObj } from "@storybook/react";

const testData = {
    name: "collection new",
    description: "collection description",
    slug: "collection_test",
    elements: [
        {
            name: "collections",
            slug: "collections",
            kind: "collections",
            collections: [
                {
                    name: "Collection 1",
                    description: null,
                    table: null,
                    slug: "collection_1",
                },
                {
                    name: "Collection 2",
                    description: null,
                    table: null,
                    slug: "collection_2",
                },
                {
                    name: "Collection 3",
                    description: null,
                    table: null,
                    slug: "collection_3",
                },
            ],
        },
        {
            name: "pages",
            slug: "pages",
            kind: "pages",
            pages: [
                {
                    name: "Page 2",
                    description:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    slug: "page_2",
                },
                {
                    name: "Page 3",
                    description:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    slug: "page_3",
                },
                {
                    name: "foo",
                    description:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    slug: "page_4",
                },
                {
                    name: "bar",
                    description:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    slug: "page_5",
                },
                {
                    name: "test",
                    description:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    slug: "test",
                },
                {
                    name: "Page 1",
                    description:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    slug: "page_1",
                },
            ],
        },
        {
            name: "another-pages",
            slug: "another-pages",
            kind: "pages",
            pages: [
                {
                    name: "new_page",
                    description:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    slug: "new_page",
                },
            ],
        },
    ],
};

type StoryPropsType = ComponentProps<typeof ElementsContent>;

const meta: Meta<StoryPropsType> = {
    component: ElementsContent,
    argTypes: {
        activeElement: {
            control: "radio",
            options: testData.elements.map((_, ind) => ind),
        },
        collectionData: {
            control: "object",
        },
    },
};

export default meta;

type StoryType = StoryObj<StoryPropsType>;

export const ElementsStory: StoryType = {
    args: {
        activeElement: 0,
        collectionData: testData,
    },
    render: (args) => <ElementsContent {...args} />,
};
