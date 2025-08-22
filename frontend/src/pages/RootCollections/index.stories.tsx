import type { Meta, StoryObj } from "@storybook/react";
import { RootCollections } from ".";

const meta: Meta<typeof RootCollections> = {
    title: "Pages/IndexPage",
    component: RootCollections,
};

export default meta;

type Story = StoryObj<typeof RootCollections>;

export const Default: Story = {
    render: () => <RootCollections />,
};
