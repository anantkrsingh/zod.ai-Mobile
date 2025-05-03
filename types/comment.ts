export interface Comment {
  id: string;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
} 