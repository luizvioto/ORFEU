import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Music,
  StickyNote,
  Trash,
  Plus,
  Edit2,
} from "lucide-react";
import Gravador from "../../components/Gravador";
import ModalCifra from "../../components/ModalCifra";
import api from "../../services/api";

const AUDIO_BASE_URL = "http://localhost:3000/uploads/";

function normalizarAudio(audio) {
  if (typeof audio === "string") {
    return {
      id: `local-${audio}`,
      titulo: "Treino sem título",
      createdAt: new Date().toISOString(),
      url: audio,
    };
  }

  return audio;
}

function obterSrcAudio(audio) {
  if (typeof audio === "string") {
    return audio;
  }

  if (audio.url) {
    return audio.url;
  }

  if (!audio.audio_url) {
    return "";
  }

  if (audio.audio_url.startsWith("http")) {
    return audio.audio_url;
  }

  return `${AUDIO_BASE_URL}${audio.audio_url}`;
}

export default function Biblioteca() {
  const [busca, setBusca] = useState("");
  const [listaAudios, setListaAudios] = useState([]);
  const [cifras, setCifras] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [cifraEmEdicao, setCifraEmEdicao] = useState(null);

  useEffect(() => {
    api.get("/cifras")
      .then((response) => setCifras(response.data))
      .catch((error) => console.error(error));

    api.get("/audios")
      .then((response) => setListaAudios(response.data))
      .catch((error) => console.error(error));
  }, []);

  const salvarCifra = (musica, artista) => {
    if (cifraEmEdicao) {
      api.put(`/cifras/${cifraEmEdicao.id}`, { musica, artista })
        .then((response) => {
          const cifraAtualizada = response.data.dados || response.data;
          setCifras((prev) =>
            prev.map((c) => (c.id === cifraEmEdicao.id ? cifraAtualizada : c))
          );
          setModalAberto(false);
        })
        .catch((error) => console.error(error));
    } else {
      api.post("/cifras", { musica, artista })
        .then((response) => {
          setCifras((prev) => [response.data, ...prev]);
          setModalAberto(false);
        })
        .catch((error) => console.error(error));
    }
  };

  const deletarCifra = (e, id) => {
    e.stopPropagation();
    api.delete(`/cifras/${id}`)
      .then(() => setCifras((prev) => prev.filter((c) => c.id !== id)))
      .catch((error) => console.error(error));
  };

  const adicionarAudioAoFeed = (novoAudio) => {
    setListaAudios((prev) => [normalizarAudio(novoAudio), ...prev]);
  };

  const deletarAudio = (id) => {
    api.delete(`/audios/${id}`)
      .then(() => setListaAudios((prev) => prev.filter((a) => a.id !== id)))
      .catch((error) => console.error(error));
  };

  const cifrasFiltradas = cifras.filter(
    (cifra) =>
      cifra.musica.toLowerCase().includes(busca.toLowerCase()) ||
      cifra.artista.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-brand-dark flex flex-col md:flex-row gap-4 md:items-baseline items-center justify-between w-full p-6 border rounded-xl">
        <div className="flex gap-2 items-center ">
          <StickyNote className="text-brand-primary" />
          <h2 className="text-brand-light text-xl">Cifras e Músicas</h2>
        </div>
        <div className="flex items-center border gap-4">
          <div className="flex items-center border gap-2">
            <Search className="text-brand-card" />
            <input
              type="text"
              placeholder="Buscar música ou artista..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="border border-brand-card bg-brand-card/10 text-brand-light p-2 rounded-xl placeholder-brand-card/70"
            />
          </div>
          <button
            onClick={() => {
              setCifraEmEdicao(null);
              setModalAberto(true);
            }}
            className="bg-brand-primary rounded-xl p-2 hover:bg-brand-primary/90 cursor-pointer shrink-0"
          >
            <Plus />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cifrasFiltradas.map((cifra) => (
          <div
            key={cifra.id}
            onClick={() => {
              window.open(cifra.link, "_blank");
            }}
            className="bg-brand-dark border rounded-xl p-4 flex gap-2 items-center justify-between cursor-pointer hover:border-brand-primary/40 transition group"
          >
            <FileText size={40} className="text-brand-primary" />
            <div className="min-w-0 w-full">
              <p className="text-brand-light text-lg truncate ">
                {cifra.musica}
              </p>
              <p className="text-brand-card">{cifra.artista}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCifraEmEdicao(cifra);
                  setModalAberto(true);
                }}
                className="text-brand-card p-2 hover:text-brand-primary cursor-pointer"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={(e) => deletarCifra(e, cifra.id)}
                className="text-brand-card p-2 hover:text-red-400 cursor-pointer"
              >
                <Trash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brand-dark flex flex-col md:flex-row gap-4 md:items-baseline items-center justify-between w-full p-6 border rounded-xl">
        <div className="flex gap-2 items-center ">
          <Music className="text-brand-primary" />
          <h2 className="text-brand-light text-xl">Áudios</h2>
        </div>
        <div className="flex items-center">
          <Gravador onNovoAudio={adicionarAudioAoFeed} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listaAudios.map((audio) => (
          <div
            key={audio.id}
            className="bg-brand-dark rounded-xl p-4 flex flex-col justify-between gap-3 border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-brand-light">{audio.titulo}</h4>
                <p className="text-brand-card">
                  {audio.createdAt
                    ? new Date(audio.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : audio.data}
                </p>
              </div>
              <button
                onClick={() => deletarAudio(audio.id)}
                title="Excluir"
                className="text-brand-card hover:text-red-400 p-1 cursor-pointer"
              >
                <Trash size={18} />
              </button>
            </div>
            <div className="w-full">
              <audio
                controls
                src={obterSrcAudio(audio)}
                className="w-full h-8 accent-brand-primary"
              />
            </div>
          </div>
        ))}
      </div>

      <ModalCifra
        aberto={modalAberto}
        fechar={() => setModalAberto(false)}
        cifraEmEdicao={cifraEmEdicao}
        aoSalvar={salvarCifra}
      />
    </div>
  );
}