// Fetch wrapper without hooks

export const fetchWrapper = async (url: string, options: RequestInit = {}, logout: () => void) => {
    try {
        const token = localStorage.getItem('accessToken');

        // Append the authorization header if the token exists
        if (token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
            };
        }

        const response = await fetch(url, options);

        // Check for 401 response status
        if (response.status === 401) {
            logout();
            // Optionally redirect
            // window.location.href = '/login';
        }

        // Return the response data
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};
