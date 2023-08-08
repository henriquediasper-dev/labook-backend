import { UserDB } from "../models/user";
import { BaseDatabase } from "./Basedatabase";

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = "users";

  public async postUser(newUser: UserDB): Promise<void> {
    await BaseDatabase.connection(UserDatabase.TABLE_USERS).insert(newUser);
  }

  public async getAllUserByEmail(email: string): Promise<UserDB | undefined> {
    const [response]: UserDB[] = await BaseDatabase.connection(
      UserDatabase.TABLE_USERS
    ).where({ email });

    return response;
  }
}
