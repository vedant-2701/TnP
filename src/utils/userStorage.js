// Set user in localStorage
export const setUser = (user) => {
    try {
        localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
        console.error("Failed to set user in localStorage:", error);
    }
};

// Get user from localStorage
export const getUser = () => {
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Failed to get user from localStorage:", error);
        return null;
    }
};

// Optional: Clear user from localStorage (e.g., for logout)
export const clearUser = () => {
    try {
        localStorage.removeItem("user");
    } catch (error) {
        console.error("Failed to clear user from localStorage:", error);
    }
};
