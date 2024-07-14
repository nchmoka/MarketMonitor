import { useState } from "react";
const validator = require("validator");

export const useContactUs = () => {
    const [error, setError] = useState(null);
    
    const [isLoading, setIsLoading] = useState(false); // Initialize isLoading with false

    const contactUs = async (name, email, subject, message) => {
        setIsLoading(true); // Set loading state to true before fetch
        setError(null);

        if(!name || !email || !subject || !message){
            setError("All fields must be filled");
            setIsLoading(false); // Set loading state to false
            return false;
        }

        if (!validator.isEmail(email)) {
            setError("Email not valid");
            setIsLoading(false); // Set loading state to false
            return false;
        }
        
        try {
            const response = await fetch("/api/contactUs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, subject, message }),
            })
            console.log(JSON.stringify({ name, email, subject, message }))
            console.log(response)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to contact us");
            }
            else{
                setError(null);
                setIsLoading(false); // Set loading state to false on successful response
                return true;
            }
        } catch (error) {
            setError(error.message || "Failed to contact us");
            setIsLoading(false); // Set loading state to false on error
        }
    };

    return { contactUs, isLoading, error, setError };
};
