import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; 
import User from "../models/user.model.js";

export default { register, login, validate };

const secret = process.env.AUTH_SECRET;

function getToken(uid, uemail) {
  const meuToken = jwt.sign({ sub: uid, email: uemail }, secret, { expiresIn: "7d" });
  return meuToken;
}

async function register(request, response) {
  try {
    const { nome, email, password } = request.body;

    if (!nome || !email || !password) {
      return response.status(400).send({ mensagem: "Informe nome, e-mail e senha!" });
    }

    const user = await User.findOne({ where: { email: email } });
    if (user) return response.status(400).send({ mensagem: "Usuário já cadastrado!" });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const novoUsuario = await User.create({ nome, email, password: hashedPassword });
    
    const meuToken = getToken(novoUsuario.id, novoUsuario.email);
    response.status(201).send({ token: meuToken, usuario: { id: novoUsuario.id, nome: novoUsuario.nome } });
  } catch (error) {
    response.status(500).send({ mensagem: "Erro interno.", erro: error.message });
  }
}

async function login(request, response) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).send({ mensagem: "Informe e-mail e senha!" });
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return response.status(400).send({ mensagem: "Usuário não cadastrado!" });
    }

    const isEqual = bcrypt.compareSync(password, user.password);
    if (!isEqual) {
      return response.status(401).send({ mensagem: "Usuário e/ou senha inválidos!" });
    }

    const meuToken = getToken(user.id, user.email);
    
    response.status(200).json({ id: user.id, nome: user.nome, email: user.email, token: meuToken });

  } catch (error) {
    response.status(500).send({ mensagem: "Erro interno.", erro: error.message });
  }
}

async function validate(request, response, next) {
  let token = request.headers.authorization;
  
  try {
    if (token && token.startsWith("Bearer ")) {
      token = token.substring(7, token.length);
      
      const decodedToken = jwt.verify(token, secret);
      
      request.usuarioLogado = decodedToken;
      
      next();
    } else {
      return response.status(401).send({ mensagem: "Acesso Negado: Token não fornecido." });
    }
  } catch (e) {
    return response.status(401).send({ mensagem: "Acesso Negado: Token inválido ou expirado." });
  }
}