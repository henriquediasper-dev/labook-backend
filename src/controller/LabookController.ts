import { Request, Response } from "express";
import { UserDatabase } from "../database/UserDatabase";
import { UserDB } from "../types";

export class LabookController {
  public createUser = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (typeof name !== "string") {
        return res.status(400).send({ error: "'name' deve ser uma string" });
      }

      if (typeof email !== "string") {
        return res.status(400).send({ error: "'email' deve ser uma string" });
      }

      if (typeof password !== "string") {
        return res
          .status(400)
          .send({ error: "'password' deve ser uma string" });
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      // Verifica se a senha corresponde ao padrão definido pelo regex.
      if (!passwordRegex.test(password)) {
        return res.status(400).send({
          error:
            "A senha deve conter pelo menos 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial (@, $, !, %, *, ?, &).",
        });
      }

      const userDatabase = new UserDatabase();

      // Verifica se um usuário com o mesmo 'email' já existe no banco de dados.
      const userDBExists = await userDatabase.findUserByEmail(email);

      if (userDBExists) {
        return res.status(400).send({ error: "'email' já existe" });
      }

      // Se o 'email' for único, cria um novo objeto User com os dados fornecidos.
      const newUser: UserDB = { name, email, password };

      // Insere o novo usuário no banco de dados.
      await userDatabase.createUser(newUser);

      // Retorna uma resposta de sucesso com os detalhes do novo usuário.
      return res
        .status(201)
        .send({ message: "Usuário criado com sucesso!", user: newUser });
    } catch (error) {
      console.log(error);

      if (req.statusCode === 200) {
        res.status(500);
      }

      if (error instanceof Error) {
        res.send({ error: error.message });
      } else {
        res.send({ error: "Erro inesperado" });
      }
    }
  };
}
