export interface PostsDB {
  id: string;
  creator_id: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
}

export interface PostDBWithCreatorName {
  id: string;
  creator_id: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  creator_name: string;
}

export interface LikeDislikeDB {
  user_id: string;
  post_id: string;
  like: number;
}

export enum POST_LIKE {
  ALREADY_LIKED = "ALREADY_LIKED",
  ALREADY_DISLIKED = "ALREADY_DISLIKED",
}

export interface PostModel {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  creator: {
    id: string;
    name: string;
  };
}

export class Post {
  constructor(
    private id: string,
    private content: string,
    private likes: number,
    private dislikes: number,
    private createdAt: string,
    private updatedAt: string,
    private creatorId: string,
    private creatorName: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public getContent(): string {
    return this.content;
  }

  public setContent(v: string): void {
    this.content = v;
  }

  public getLikes(): number {
    return this.likes;
  }

  public setLikes(v: number): void {
    this.likes = v;
  }

  public addLike = (): void => {
    this.likes++;
  };

  public removeLike = (): void => {
    this.likes--;
  };

  public getDislikes(): number {
    return this.dislikes;
  }

  public setDislikes(v: number): void {
    this.dislikes = v;
  }

  public addDislike = (): void => {
    this.dislikes++;
  };

  public removeDislike = (): void => {
    this.dislikes--;
  };

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public getUpdatedAt(): string {
    return this.updatedAt;
  }

  public setUpdatedAt(v: string): void {
    this.updatedAt = v;
  }

  public getCreatorId(): string {
    return this.creatorId;
  }

  public setCreatorId(v: string): void {
    this.creatorId = v;
  }

  public getCreatorName(): string {
    return this.creatorName;
  }

  public setCreatorName(v: string): void {
    this.creatorName = v;
  }

  public toDBModel(): PostsDB {
    return {
      id: this.id,
      creator_id: this.creatorId,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  public toBusinessModel(): PostModel {
    return {
      id: this.id,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      creator: {
        id: this.creatorId,
        name: this.creatorName,
      },
    };
  }
}
