import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

const validator = require("validator");

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const signup = async (email, password, confirmPassword) => {
        setIsLoading(true);
        setError(null);

        // validation
        if (!email || !password || !confirmPassword) {
            setError("All fields must be filled");
            setIsLoading(false);
            return false;
        }
        if (!validator.isEmail(email)) {
            setError("Email not valid");
            setIsLoading(false);
            return false;
        }
        if (!validator.isStrongPassword(password)) {
            setError("Password not strong enough:\nAt least: 8 characters long, one uppercase letter, one lowercase letter, one number, one special character");
            setIsLoading(false);
            return false;
        }
        if (confirmPassword != password) {
            setError("Passwords do not match");
            setIsLoading(false);
            return false;
        }

        const response = await fetch("/api/user/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, confirmPassword }),
        });
        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
            return false;
        }
        if (response.ok) {
            // save the user to local storage
            localStorage.setItem("user", JSON.stringify(json));

            // update the auth context
            dispatch({ type: "LOGIN", payload: json });

            // update loading state
            setIsLoading(false);
            return true;
        }
    };

    return { signup, isLoading, error, setError };
};
