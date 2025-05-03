import { get } from '../utils/api';

export const searchCreations = async (query: string) => {
    try {
        const response = await get('/api/creations/search', { query });
        return response;
    } catch (error) {
        console.error('Search error:', error);
        throw error;
    }
}; 