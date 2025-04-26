import { get } from '../utils/api';

interface Image {
  id: string;
  url: string;
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
}

interface GetCreationsResponse {
  creations: Creation[];
  currentPage: number;
  totalCreations: number;
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

  async getCreations(page: number): Promise<GetCreationsResponse> {
    try {
      return await get<GetCreationsResponse>(`/api/creations/get-creations`, { page });
    } catch (error) {
      console.error('Error fetching creations:', error);
      throw error;
    }
  }
}

export default ContentService; 