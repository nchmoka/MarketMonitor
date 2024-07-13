import { useState } from "react";

export const useContactUs = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Initialize isLoading with false

    const contactUs = async (name, email, subject, message) => {
        setIsLoading(true); // Set loading state to true before fetch

        try {
            const response = await fetch("/api/contactUs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, subject, message }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to contact us");
            }

            setIsLoading(false); // Set loading state to false on successful response
        } catch (error) {
            setError(error.message || "Failed to contact us");
            setIsLoading(false); // Set loading state to false on error
        }
    };

    return { contactUs, isLoading, error };
};
