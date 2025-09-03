import { ComponentProps } from "react";
import { Collections } from ".";
import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";

type StoryPropsType = ComponentProps<typeof Collections>;

const meta: Meta<StoryPropsType> = {
    component: Collections,
    decorators: [
        (Story) => {
            const queryClient = new QueryClient();
            return (
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter
                        initialEntries={["/collections/collection_test"]}
                    >
                        <Routes>
                            <Route
                                path="/collections/:collection_slug"
                                element={<Story />}
                            />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            );
        },
    ],
};

export default meta;

type StoryType = StoryObj<StoryPropsType>;

export const CollectionPageStory: StoryType = {
    render: () => <Collections />,
};
