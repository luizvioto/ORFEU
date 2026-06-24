import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ModalCifra({
  aberto,
  fechar,
  cifraEmEdicao,
  aoSalvar,
}) {
  const [musica, setMusica] = useState("");
  const [artista, setArtista] = useState("");

  useEffect(() => {
    if (cifraEmEdicao) {
      setMusica(cifraEmEdicao.musica);
      setArtista(cifraEmEdicao.artista);
    } else {
      setMusica("");
      setArtista("");
    }
  }, [cifraEmEdicao, aberto]);

  if (!aberto) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    aoSalvar(musica, artista);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-brand-dark w-full max-w-md rounded-2xl p-6 space-y-4">
        {/* header */}
        <div className="flex justify-between items-center">
          <h3 className="text-brand-light text-lg">
            {cifraEmEdicao ? "Editar Cifra" : "Nova Cifra"}
          </h3>
          <button
            onClick={fechar}
            className="text-brand-card hover:text-brand-light "
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-1">
            <label className="text-brand-primary">Nome da Música</label>
            <input
              type="text"
              required
              placeholder="Ex: Tempo Perdido"
              value={musica}
              onChange={(e) => setMusica(e.target.value)}
              className="w-full bg-brand-card/10 border border-brand-card p-2 rounded-xl text-brand-light"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-brand-primary">Artista</label>
            <input
              type="text"
              required
              placeholder="Ex: Legião Urbana"
              value={artista}
              onChange={(e) => setArtista(e.target.value)}
              className="w-full bg-brand-card/10 border border-brand-card p-2 rounded-xl text-brand-light"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={fechar}
              className="border rounded-xl p-2 flex gap-2 bg-brand-primary justify-center items-center hover:bg-brand-primary/90 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="border rounded-xl p-2 flex gap-2 bg-brand-primary justify-center items-center hover:bg-brand-primary/90 cursor-pointer"
            >
              {cifraEmEdicao ? "Salvar Alterações" : "Gerar Cifra"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
