import { useState, useEffect } from "react";
import { Clock, CheckCircle, Music, Mic, FileText } from "lucide-react";
import api from "../../services/api";

export default function VisaoGeralAluno({ minutosPraticados }) {
  const [cifras, setCifras] = useState([]);
  const [audios, setAudios] = useState([]);

  const nomeCompleto = localStorage.getItem("aluno_nome") || "Aluno";
  const nomeAluno = nomeCompleto.trim().split(/\s+/)[0] || "Aluno";

  useEffect(() => {
    Promise.all([api.get("/cifras"), api.get("/audios")])
      .then(([cifrasResponse, audiosResponse]) => {
        setCifras(cifrasResponse.data);
        setAudios(audiosResponse.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const stats = [
    { id: 1, valor: minutosPraticados, nome: "Minutos Praticados", icone: Clock },
    { id: 2, valor: cifras.length, nome: "Cifras salvas", icone: CheckCircle },
    { id: 3, valor: audios.length, nome: "Treinos gravados", icone: Music },
  ];

  const ultimasCifras = [...cifras].reverse().slice(0, 3);
  const ultimosAudios = [...audios].slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="bg-brand-dark p-6 border rounded-2xl">
        <h2 className="text-brand-primary text-2xl">
          Bem-vindo de volta, {nomeAluno}!
        </h2>
      </div>

      <div className="space-y-2">
        <h3 className="text-brand-card text-lg">Stats</h3>
        <div className="grid md:grid-cols-3 gap-4 grid-cols-1">
          {stats.map((stat) => {
            const Icone = stat.icone;
            return (
              <div
                key={stat.id}
                className="bg-brand-dark border rounded-xl p-4 space-y-2"
              >
                <p className="text-brand-primary flex justify-between text-xl items-center">
                  {stat.nome} <Icone />
                </p>
                <p className="text-brand-light text-3xl">{stat.valor}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        <div className="bg-brand-dark p-6 border rounded-xl space-y-4">
          <div className="text-brand-primary flex gap-2 items-center">
            <Music />
            <h3 className="text-brand-light text-xl">Adicionadas Recentemente</h3>
          </div>

          <div className="space-y-3">
            {ultimasCifras.length > 0 ? (
              ultimasCifras.map((cifra) => (
                <div 
                  key={cifra.id} 
                  className="border border-brand-card rounded-xl bg-brand-card/10 flex justify-between items-center p-4 cursor-pointer hover:border-brand-primary/40 transition"
                  onClick={() => window.open(cifra.link, "_blank")}
                >
                  <div className="min-w-0">
                    <p className="text-brand-light text-lg truncate font-medium">{cifra.musica}</p>
                    <p className="text-brand-card text-sm truncate">{cifra.artista}</p>
                  </div>
                  <FileText className="text-brand-primary/50 shrink-0" />
                </div>
              ))
            ) : (
              <p className="text-brand-card text-sm">Nenhuma cifra salva ainda.</p>
            )}
          </div>
        </div>

        <div className="bg-brand-dark p-6 border rounded-xl space-y-4 ">
          <div className="text-brand-primary flex gap-2 items-center flex-0">
            <Mic />
            <h3 className="text-brand-light text-xl">Últimos Treinos</h3>
          </div>

          <div className="space-y-3">
            {ultimosAudios.length > 0 ? (
              ultimosAudios.map((audio) => (
                <div
                  key={audio.id}
                  className="border border-brand-card rounded-xl bg-brand-card/10 p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-brand-light font-medium">{audio.titulo}</p>
                    <p className="text-brand-card text-xs">
                      {audio.createdAt
                        ? new Date(audio.createdAt).toLocaleDateString("pt-BR")
                        : ""}
                    </p>
                  </div>
                  <audio
                    controls
                    src={audio.url ? audio.url : `http://localhost:3000/uploads/${audio.audio_url}`}
                    className="w-full h-8 accent-brand-primary"
                  />
                </div>
              ))
            ) : (
              <p className="text-brand-card text-sm">Nenhum treino gravado ainda.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}