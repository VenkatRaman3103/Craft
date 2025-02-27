import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { Collections } from "./Pages/Collections/index.tsx";
import { Collection } from "./Pages/Collection/index.tsx";
import { Page } from "./Pages/Page/index.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error(
        "Root element not found. Make sure there is an element with id='root' in your HTML.",
    );
}

createRoot(rootElement).render(
    <BrowserRouter>
        <Routes>
            <Route path="/collections" element={<Collections />} />
            <Route
                path="/collections/:collection_id"
                element={<Collections />}
            />
            <Route path="/collection/:collection_id" element={<Collection />} />
            <Route path="/pages/:page_id" element={<Page />} />
        </Routes>
    </BrowserRouter>,
);
