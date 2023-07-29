import { UserDB } from "../types";
import { BaseDatabase } from "./Basedatabase";

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = "users";

  public async findUserByEmail(email: string): Promise<UserDB | undefined> {
    const [response]: UserDB[] = await BaseDatabase.connection(
      UserDatabase.TABLE_USERS
    ).where({ email });

    return response;
  }

  public createUser = async (userDB: UserDB): Promise<void> => {
    // Lógica para inserir o novo usuário no banco de dados real.
    await BaseDatabase.connection(UserDatabase.TABLE_USERS).insert(userDB);
  };
}
