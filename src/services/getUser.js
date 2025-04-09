export const getUser = () => {
    const userStr = localStorage.getItem('user');

    if (!userStr) {
        return;
    }

    try {
        const userData = JSON.parse(userStr);
        return userData;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return;
    }
}