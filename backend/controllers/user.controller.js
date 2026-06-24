import User from "../models/user.model.js";

async function updateProfile(request, response) {
  try {
    const idDoAluno = request.usuarioLogado.sub; 
    const { telefone, bio } = request.body;

    const user = await User.findByPk(idDoAluno);
    if (!user) {
      return response.status(404).send({ mensagem: "Aluno não encontrado." });
    }

    let caminhoDaFoto = user.avatar_url; 

    if (request.file) {
      caminhoDaFoto = request.file.filename; 
    }

    await user.update({
      telefone: telefone,
      bio: bio,
      avatar_url: caminhoDaFoto
    });

    response.send({ 
      mensagem: "Perfil atualizado com sucesso!", 
      avatar_url: caminhoDaFoto 
    });

  } catch (error) {
    response.status(500).send({ mensagem: "Erro ao atualizar perfil.", erro: error.message });
  }
}

async function getProfile(request, response) {
  try {
    const idDoAluno = request.usuarioLogado.sub; 
    const user = await User.findByPk(idDoAluno, {
      attributes: ['nome', 'email', 'telefone', 'bio', 'avatar_url'] // Retorna só os dados públicos
    });
    
    if (!user) return response.status(404).send({ mensagem: "Aluno não encontrado." });
    response.send(user);
  } catch (error) {
    response.status(500).send({ mensagem: "Erro ao buscar perfil.", erro: error.message });
  }
}

export default { updateProfile, getProfile };