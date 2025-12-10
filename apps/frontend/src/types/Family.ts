export interface Family {
  id: string;
  name: string;
  createdAt: string;
  members?: {
    userId: string;
    role: string;
    user: {
      name: string;
      email: string;
    };
  }[];
}
