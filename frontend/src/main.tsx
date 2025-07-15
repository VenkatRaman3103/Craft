import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { Collections } from "./Pages/Collections/index.tsx";
import { Collection } from "./Pages/Collection/index.tsx";
import { Page } from "./Pages/Page/index.tsx";
import { Explorer } from "./Components/Explorer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Canvas } from "./Canvas/index.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { Projects } from "./Pages/Canvas/Projects/index.tsx";
import { Project } from "./Pages/Canvas/Project/index.tsx";
import { ApiEditor } from "./ApiLayer/index.tsx";
import { ApiProjects } from "./Pages/ApiLayer/Projects/index.tsx";
import { DBLayer } from "./Pages/DBLayer/index.tsx";
import { MediaBucket } from "./Pages/MediaBucket/index.tsx";

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
                <Explorer>
                    <Routes>
                        <Route path="/collections" element={<Collections />} />
                        <Route
                            path="/collections/:collection_id"
                            element={<Collections />}
                        />
                        <Route
                            path="/collection/:collection_id"
                            element={<Collection />}
                        />
                        <Route path="/pages/:page_id" element={<Page />} />

                        {/* figma layer */}
                        <Route path="/canvas/projects" element={<Projects />} />
                        <Route
                            path="/canvas/projects/:project_id"
                            element={<Project />}
                        />
                        <Route
                            path="/canvas/pages/:page_id"
                            element={<Canvas />}
                        />

                        {/* api layer */}
                        <Route path="/api-layer" element={<ApiProjects />} />
                        <Route
                            path="/api-layer/:api_id"
                            element={<ApiEditor />}
                        />

                        {/* media bucket */}
                        <Route
                            path="/media-buckets"
                            element={<MediaBucket />}
                        />

                        <Route
                            path="/media-buckets/:bucket_id"
                            element={<MediaBucket />}
                        />

                        {/* DB layer */}
                        <Route path="/db-layer" element={<DBLayer />} />
                    </Routes>
                </Explorer>
            </QueryClientProvider>
        </Provider>
    </BrowserRouter>,
);
