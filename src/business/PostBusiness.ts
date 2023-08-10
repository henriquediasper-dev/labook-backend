import { PostDatabase } from "../database/PostDatabase";
import {
  CreatePostInputDTO,
  CreatePostOutputDTO,
} from "../dtos/post/createPost.dto";
import {
  DeletePostInputDTO,
  DeletePostOutputDTO,
} from "../dtos/post/deletePost.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/post/editPost.dto";
import { GetPostInputDTO, GetPostOutputDTO } from "../dtos/post/getPost.dto";
import {
  LikeOrDislikePostInputDTO,
  LikeOrDislikePostOutputDTO,
} from "../dtos/post/likeOrDislikePost.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { LikeDislikeDB, POST_LIKE, Post } from "../models/posts";
import { USER_ROLES } from "../models/user";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public getPost = async (
    input: GetPostInputDTO
  ): Promise<GetPostOutputDTO> => {
    const { token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Token inválido");
    }

    const postsWithCreatorName =
      await this.postDatabase.getAllPostsWithCreatorName();

    const posts = postsWithCreatorName.map((postWithCreatorName) => {
      const post = new Post(
        postWithCreatorName.id,
        postWithCreatorName.content,
        postWithCreatorName.likes,
        postWithCreatorName.dislikes,
        postWithCreatorName.created_at,
        postWithCreatorName.updated_at,
        postWithCreatorName.creator_id,
        postWithCreatorName.creator_name
      );
      return post.toBusinessModel();
    });

    const output: GetPostOutputDTO = posts;

    return output;
  };

  public createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostOutputDTO> => {
    const { token, content } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Token inválido");
    }

    const id = this.idGenerator.generate();

    const newPost = new Post(
      id,
      content,
      0,
      0,
      new Date().toString(),
      new Date().toString(),
      payload.id,
      payload.name
    );

    const newPostDB = newPost.toDBModel();
    await this.postDatabase.createPost(newPostDB);

    const output: CreatePostOutputDTO = undefined;

    return output;
  };

  public editPost = async (
    input: EditPostInputDTO
  ): Promise<EditPostOutputDTO> => {
    const { token, idToEdit, content } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Token inválido");
    }

    const postDBExists = await this.postDatabase.getAllPostById(idToEdit);

    if (!postDBExists) {
      throw new NotFoundError("Post não encontrado");
    }

    if (postDBExists.creator_id !== payload.id) {
      throw new UnauthorizedError(
        "Somente o criador da postagem pode editá-la"
      );
    }

    const post = new Post(
      postDBExists.id,
      postDBExists.content,
      postDBExists.likes,
      postDBExists.dislikes,
      postDBExists.created_at,
      postDBExists.updated_at,
      postDBExists.creator_id,
      payload.name
    );

    post.setContent(content);

    const updatePostDB = post.toDBModel();
    await this.postDatabase.editPost(updatePostDB);

    const output: EditPostOutputDTO = undefined;

    return output;
  };

  public deletePost = async (
    input: DeletePostInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const { token, idToDelete } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Token inválido");
    }

    const postDBExists = await this.postDatabase.getAllPostById(idToDelete);

    if (!postDBExists) {
      throw new NotFoundError("Id da postagem não existe");
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== postDBExists.creator_id) {
        throw new ForbiddenError(
          "Somente o criador da postagem pode excluí-la"
        );
      }
    }

    await this.postDatabase.removePost(idToDelete);

    const output: DeletePostOutputDTO = undefined;

    return output;
  };

  public likeOrDislikePost = async (
    input: LikeOrDislikePostInputDTO
  ): Promise<LikeOrDislikePostOutputDTO> => {
    const { token, idToLikeOrDislike, like } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Token inválido");
    }

    const postDBWithCreatorName =
      await this.postDatabase.getAllPostsWithCreatorNameById(idToLikeOrDislike);

    if (!postDBWithCreatorName) {
      throw new NotFoundError("Id da postagem não foi encontrado");
    }

    const post = new Post(
      postDBWithCreatorName.id,
      postDBWithCreatorName.content,
      postDBWithCreatorName.likes,
      postDBWithCreatorName.dislikes,
      postDBWithCreatorName.created_at,
      postDBWithCreatorName.updated_at,
      postDBWithCreatorName.creator_id,
      postDBWithCreatorName.creator_name
    );

    const likeSQlite = like ? 1 : 0;

    const likeOrDislikeDB: LikeDislikeDB = {
      user_id: payload.id,
      post_id: postDBWithCreatorName.id,
      like: likeSQlite,
    };

    const likeOrDislikePostExists =
      await this.postDatabase.getAllLikeDislikePost(likeOrDislikeDB);

    if (post.getCreatorId() === payload.id) {
      throw new ForbiddenError(
        "O criador da postagem não pode dar likes ou dislikes"
      );
    }

    if (likeOrDislikePostExists === POST_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.postDatabase.removeLikeOrDislike(likeOrDislikeDB);
        post.removeLike();
      } else {
        await this.postDatabase.updateLikeOrDislike(likeOrDislikeDB);
        post.removeLike();
        post.addDislike();
      }
    } else if (likeOrDislikePostExists === POST_LIKE.ALREADY_DISLIKED) {
      if (like === false) {
        await this.postDatabase.removeLikeOrDislike(likeOrDislikeDB);
        post.removeDislike();
      } else {
        await this.postDatabase.updateLikeOrDislike(likeOrDislikeDB);
        post.removeDislike();
        post.addLike();
      }
    } else {
      await this.postDatabase.insertLikeOrDislike(likeOrDislikeDB);
      like ? post.addLike() : post.addDislike();
    }

    const updatedPostDB = post.toDBModel();
    await this.postDatabase.editPost(updatedPostDB);

    const output: LikeOrDislikePostOutputDTO = undefined;

    return output;
  };
}
