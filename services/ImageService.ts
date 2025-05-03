import { post } from "@/utils/api";


export interface ImageResponse {
    imageUrl: string;
    message: string;
}
export const generateImage = async (prompt: string, category: string, tier: string) => {
    try {
        const response = await post<ImageResponse>("/api/creations/new-creation", { prompt, category, isPremium: tier === "premium" })
        return response.imageUrl
    } catch (error: any) {
        console.log(error.response.data)
        if (error.response?.data) {
            throw error.response.data.message;
        }
        throw new Error('Network error');
    }
};
