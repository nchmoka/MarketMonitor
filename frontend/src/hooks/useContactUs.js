import { useState } from "react";
const validator = require("validator");

export const useContactUs = () => {
    const [error, setError] = useState(null);
    
    const [isLoading, setIsLoading] = useState(null);

    const contactUs = async (name, email, subject, message) => {
        setIsLoading(true); 
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
            const json = await response.json();
            if (!response.ok) {
                setIsLoading(false);
                setError(json.error);
            }
            if (response.ok){
                setError(null);
                setIsLoading(false); // Set loading state to false on successful response
                return true;
            }
        } catch (error) {
            setIsLoading(false);
            setError(error.message);
        }
    };

    return { contactUs, isLoading, error, setError };
};
