import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { Collection } from "./Pages/Colletion/index.tsx";
import { CollectionsPage } from "./Pages/Collections/index.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error(
        "Root element not found. Make sure there is an element with id='root' in your HTML.",
    );
}

createRoot(rootElement).render(
    <BrowserRouter>
        <Routes>
            <Route path="/collections" element={<App />} />
            <Route
                path="/collections/:collection_id"
                element={<CollectionsPage />}
            />
        </Routes>
    </BrowserRouter>,
);
