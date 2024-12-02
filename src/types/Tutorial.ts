export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnailUrl: string;
  steps: TutorialStep[];
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  published: boolean;
  tags: string[];
}

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  order: number;
  duration?: number;
}
