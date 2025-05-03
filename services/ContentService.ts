import { get, post } from '../utils/api';
import { Comment as CommentType } from '../types/comment';

interface Image {
  id: string;
  url: string;
  isPremium: boolean;
  prompt: string;
}

interface CreatedBy {
  id: string;
  name: string;
}

interface Creation {
  id: string;
  createdAt: string;
  createdBy: CreatedBy;
  displayImage: string | null;
  image: Image;
  imageId: string;
  userId: string;
  isLiked: boolean;
}

interface GetCreationsResponse {
  creations: Creation[];
  currentPage: number;
  totalCreations: number;
  totalPages: number;
}

interface GetCommentsResponse {
  comments: CommentType[];
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

class ContentService {
  private static instance: ContentService;

  public static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  async getCreations(page: number, search?: string): Promise<GetCreationsResponse> {
    try {
      return await get<GetCreationsResponse>(`/api/creations/get-creations`, { page, search });
    } catch (error) {
      console.error('Error fetching creations:', error);
      throw error;
    }
  }

  async likeCreation(creationId: string): Promise<void> {
    try {
      await post(`/api/creations/${creationId}/like`);
    } catch (error) {
      console.error('Error liking creation:', error);
      throw error;
    }
  }

  async getComments(creationId: string, page: number = 1, limit: number = 10): Promise<GetCommentsResponse> {
    try {
      if (!creationId) return { comments: [], hasMore: false, currentPage: 1, totalPages: 1 };
      return await get<GetCommentsResponse>(`/api/creations/${creationId}/comments`, { page, limit });
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  async addComment(creationId: string, text: string): Promise<CommentType> {
    try {
      return await post<CommentType>(`/api/creations/${creationId}/comments`, { text });
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }
}

export default ContentService; 