import Audio from "../models/audio.model.js";

async function listarAudios(request, response) {
  try {
    const idDoAluno = request.usuarioLogado.sub;
    
    const audios = await Audio.findAll({
      where: { userId: idDoAluno },
      order: [['createdAt', 'DESC']]
    });
    
    response.send(audios);
  } catch (error) {
    response.status(500).send({ mensagem: "Erro ao buscar áudios.", erro: error.message });
  }
}

async function salvarAudio(request, response) {
  try {
    const idDoAluno = request.usuarioLogado.sub;
    const { titulo } = request.body;

    if (!request.file) {
      return response.status(400).send({ mensagem: "Nenhum arquivo de áudio recebido." });
    }

    const novoAudio = await Audio.create({
      titulo: titulo || "Treino sem título",
      audio_url: request.file.filename,
      userId: idDoAluno
    });

    response.status(201).send(novoAudio);
  } catch (error) {
    response.status(500).send({ mensagem: "Erro ao salvar o áudio.", erro: error.message });
  }
}

async function deletarAudio(request, response) {
  try {
    const idDoAluno = request.usuarioLogado.sub;
    const { id } = request.params;

    const audio = await Audio.findOne({ where: { id: id, userId: idDoAluno } });

    if (!audio) {
      return response.status(404).send({ mensagem: "Áudio não encontrado." });
    }

    await audio.destroy();
    
    response.send({ mensagem: "Áudio excluído com sucesso!" });
  } catch (error) {
    response.status(500).send({ mensagem: "Erro ao excluir o áudio.", erro: error.message });
  }
}

export default { listarAudios, salvarAudio, deletarAudio };