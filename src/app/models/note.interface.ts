export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  lastEdited: Date;
  isArchived: boolean;
}
