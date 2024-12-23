export const TmdbFetch = async (url: string, options: RequestInit = {}) => {
    try {

        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        };

        if (!url.startsWith('/'))
            url = '/' + url
        const response = await fetch(`https://api.themoviedb.org/3${url}`, options);

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};
