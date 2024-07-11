import { useState } from "react";

export const useContactUs = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const contactUs = async (name, email, message) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/ContactUs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message }),
        });
        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }
        if (response.ok) {
            // update loading state
            setIsLoading(false);
        }
    };

    return { contactUs, isLoading, error };
};
