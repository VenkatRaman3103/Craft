import { createRoot } from "react-dom/client";
import "./index.scss";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store";

import "@/styles/global.scss";
import { GroupsPage } from "./pages/GroupsPage";
import { CollectionPage } from "./pages/CollectionPage";
import { PageWrapper } from "./components/PageWrapper";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error(
        "Root element not found. Make sure there is an element with id='root' in your HTML.",
    );
}

const queryClient = new QueryClient();

createRoot(rootElement).render(
    <BrowserRouter>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <PageWrapper>
                    <Routes>
                        <Route path="/collections" element={<GroupsPage />} />
                        <Route
                            path="/collections/:collection_id"
                            element={<CollectionPage />}
                        />
                    </Routes>
                </PageWrapper>
            </QueryClientProvider>
        </Provider>
    </BrowserRouter>,
);
