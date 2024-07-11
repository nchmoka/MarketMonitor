import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { CompaniesContextProvider } from "./context/CompaniesContext";
import { AuthContextProvider } from "./context/AuthContext";
import "./index.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AuthContextProvider>
            <CompaniesContextProvider>
                <App />
            </CompaniesContextProvider>
        </AuthContextProvider>
    </React.StrictMode>
);
