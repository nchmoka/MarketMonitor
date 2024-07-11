import { CompaniesContext } from "../context/CompaniesContext";
import { useContext } from "react";

export const useCompaniesContext = () => {
    const context = useContext(CompaniesContext);
    if (!context) {
        throw Error(
            "useCompaniesContext must be used within a CompaniesContextProvider"
        );
    }
    return context;
};
