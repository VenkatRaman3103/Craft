import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";

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
        </Routes>
    </BrowserRouter>,
);
