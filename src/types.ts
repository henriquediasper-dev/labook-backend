//Enum limita a tipo normal ou admin
export enum typeUser {
  Admin = "Admin",
  Normal = "Normal",
}

export type UserDB = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: typeUser;
  created_at: string;
};

export interface postsDB {
  id: string;
  creator_id: string;
  content: string;
  likes: number;
  dislikes: number;
  updated_at: string;
}
