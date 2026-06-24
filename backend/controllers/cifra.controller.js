import Cifra from "../models/cifra.model.js";

export default { getAll, getById, create, update, deleteCifra };

function formatarParaUrl(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
}

async function getAll(request, response) {
    try {
        const idDoAluno = request.usuarioLogado.sub;

        const cifras = await Cifra.findAll({
            where: { userId: idDoAluno }, 
        });
        response.send(cifras);
    } catch (error) {
        response.status(500).send({
            mensagem: "Erro ao buscar as cifras.",
            erro: error.message,
        });
    }
}

async function getById(request, response) {
    try {
        const cifra = await Cifra.findByPk(request.params.id);

        if (!cifra) {
            return response
                .status(404)
                .send({ mensagem: "Cifra não encontrada." });
        }

        response.send(cifra);
    } catch (error) {
        response
            .status(500)
            .send({ mensagem: "Erro ao buscar a cifra.", erro: error.message });
    }
}

async function create(request, response) {
    try {
        const { musica, artista } = request.body;
        const idDoAluno = request.usuarioLogado.sub;

        const artistaUrl = formatarParaUrl(artista);
        const musicaUrl = formatarParaUrl(musica);
        const linkGerado = `https://www.cifraclub.com.br/${artistaUrl}/${musicaUrl}/imprimir.html`;

        const novaCifra = await Cifra.create({
            musica: musica,
            artista: artista,
            link: linkGerado,
            userId: idDoAluno,
        });

        response.status(201).send(novaCifra);
    } catch (error) {
        response
            .status(500)
            .send({ mensagem: "Erro ao salvar a cifra.", erro: error.message });
    }
}

async function update(request, response) {
    try {
        const { id } = request.params;
        const { musica, artista } = request.body;

        const cifra = await Cifra.findByPk(id);
        if (!cifra) {
            return response
                .status(404)
                .send({ mensagem: "Cifra não encontrada para edição." });
        }

        const artistaUrl = formatarParaUrl(artista);
        const musicaUrl = formatarParaUrl(musica);
        const linkGerado = `https://www.cifraclub.com.br/${artistaUrl}/${musicaUrl}/imprimir.html`;

        await Cifra.update(
            { musica, artista, link: linkGerado },
            { where: { id: id } },
        );

        response.send({
            mensagem: "Cifra atualizada com sucesso!",
            dados: { id, musica, artista, link: linkGerado },
        });
    } catch (error) {
        response.status(500).send({
            mensagem: "Erro ao atualizar a cifra.",
            erro: error.message,
        });
    }
}

async function deleteCifra(request, response) {
    try {
        const { id } = request.params;

        const cifra = await Cifra.findByPk(id);
        if (!cifra) {
            return response
                .status(404)
                .send({ mensagem: "Cifra não encontrada para exclusão." });
        }

        await Cifra.destroy({
            where: { id: id },
        });

        response.send({
            mensagem: "Cifra removida com sucesso de sua biblioteca!",
        });
    } catch (error) {
        response.status(500).send({
            mensagem: "Erro ao excluir a cifra.",
            erro: error.message,
        });
    }
}
