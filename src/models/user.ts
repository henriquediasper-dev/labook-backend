// Enum limita a tipo normal ou admin
export enum USER_ROLES {
  ADMIN = "ADMIN",
  NORMAL = "NORMAL",
}

export interface TokenPayload {
  id: string;
  name: string;
  role: USER_ROLES;
}

export interface UserDB {
  id: string;
  name: string;
  email: string;
  password: string;
  role: USER_ROLES;
  created_at: string;
}

export interface UserModel {
  id: string;
  name: string;
  email: string;
  role: USER_ROLES;
  createdAt: string;
}

export class User {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private password: string,
    private role: USER_ROLES,
    private createdAt: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }
  public setName(value: string): void {
    this.name = value;
  }

  public getEmail(): string {
    return this.email;
  }
  public setEmail(value: string): void {
    this.email = value;
  }

  public getPassword(): string {
    return this.password;
  }
  public setPassword(value: string): void {
    this.password = value;
  }

  public getRole(): USER_ROLES {
    return this.role;
  }
  public setRole(value: string): USER_ROLES {
    return this.role;
  }

  public getCreated_at(): string {
    return this.createdAt;
  }

  public toUserDB(): UserDB {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      created_at: this.createdAt,
    };
  }

  public toUserModel(): UserModel {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}
