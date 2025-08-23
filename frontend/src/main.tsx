import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store";
import { RootCollections } from "./pages/RootCollections";
import { Collections } from "./pages/Collections";

import "@/styles/global.scss";

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
                <Routes>
                    <Route path="/collections" element={<RootCollections />} />
                    <Route
                        path="/collections/:collection_slug"
                        element={<Collections />}
                    />
                </Routes>
            </QueryClientProvider>
        </Provider>
    </BrowserRouter>,
);
