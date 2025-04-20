import { post } from "@/utils/api";


export interface ImageResponse {
    imageUrl: string;
    message: string;
}
export const generateImage = async (prompt: string) => {
    try {
        const response = await post<ImageResponse>("/api/creations/new-creation", { prompt })
        return response.imageUrl
    } catch (error: any) {
        console.log(error.response.data)
        if (error.response?.data) {
            throw error.response.data.message;
        }
        throw new Error('Network error');
    }
};
