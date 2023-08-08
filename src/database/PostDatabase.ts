import {
  LikeDislikeDB,
  POST_LIKE,
  PostDBWithCreatorName,
  PostsDB,
} from "../models/posts";
import { BaseDatabase } from "./Basedatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts";
  public static TABLE_LIKES_DISLIKES = "likes_dislikes";

  public getAllPostsWithCreatorName = async (): Promise<
    PostDBWithCreatorName[]
  > => {
    const response: PostsDB[] = await BaseDatabase.connection(
      PostDatabase.TABLE_POSTS
    )
      .select(
        `${PostDatabase.TABLE_POSTS}.id`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${PostDatabase.TABLE_POSTS}.content`,
        `${PostDatabase.TABLE_POSTS}.likes`,
        `${PostDatabase.TABLE_POSTS}.dislikes`,
        `${PostDatabase.TABLE_POSTS}.created_at`,
        `${PostDatabase.TABLE_POSTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      );
    return response as PostDBWithCreatorName[];
  };

  public getAllPostById = async (id: string): Promise<PostsDB | undefined> => {
    const [postDB]: PostsDB[] | undefined[] = await BaseDatabase.connection(
      PostDatabase.TABLE_POSTS
    ).where({ id });
    return postDB;
  };

  public createPost = async (newPost: PostsDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(newPost);
  };

  public editPost = async (newPost: PostsDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .update(newPost)
      .where({ id: newPost.id });
  };

  public removePost = async (id: string): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).del().where({ id });
  };

  public getAllPostsWithCreatorNameById = async (
    id: string
  ): Promise<PostDBWithCreatorName | undefined> => {
    const [result] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .select(
        `${PostDatabase.TABLE_POSTS}.id`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${PostDatabase.TABLE_POSTS}.content`,
        `${PostDatabase.TABLE_POSTS}.likes`,
        `${PostDatabase.TABLE_POSTS}.dislikes`,
        `${PostDatabase.TABLE_POSTS}.created_at`,
        `${PostDatabase.TABLE_POSTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
      .where({
        [`${PostDatabase.TABLE_POSTS}.id`]: id,
      });
    return result as PostDBWithCreatorName | undefined;
  };

  public getAllLikeDislikePost = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<POST_LIKE | undefined> => {
    const [result] = await BaseDatabase.connection(
      PostDatabase.TABLE_LIKES_DISLIKES
    ).where({
      user_id: likeDislikeDB.user_id,
      post_id: likeDislikeDB.post_id,
    });

    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return POST_LIKE.ALREADY_LIKED;
    } else {
      return POST_LIKE.ALREADY_DISLIKED;
    }
  };

  public removeLikeOrDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .del()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  };

  public updateLikeOrDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  };

  public insertLikeOrDislike = async (
    likeOrDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).insert(
      likeOrDislikeDB
    );
  };
}
