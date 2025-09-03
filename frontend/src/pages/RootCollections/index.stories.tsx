import { ComponentProps } from "react";
import { RootCollections } from ".";
import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";

type StoryPropType = ComponentProps<typeof RootCollections>;

const meta: Meta<StoryPropType> = {
    component: RootCollections,
    decorators: [
        (Story) => {
            const queryClient = new QueryClient();

            return (
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={["/collections"]}>
                        <Routes>
                            <Route path="/collections" element={<Story />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );
        },
    ],
};

export default meta;

type StoryType = StoryObj<StoryPropType>;

export const RootCollectionsStory: StoryType = {
    args: {},
    render: () => <RootCollections />,
};
