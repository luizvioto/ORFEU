import { useState } from "react";
import orfeuImg from "../../assets/orfeu.png";
import api from "../../services/api"; 

export default function Login({ onLoginSimulado }) {
  
  const [isLogin, setIsLogin] = useState(true);
  
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  
  
  const [erro, setErro] = useState("");

  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setErro(""); 

    try {
      if (isLogin) {
        
        if (!email || !senha) {
          return setErro("Preencha todos os campos");
        }

        const response = await api.post("/signin", { 
          email: email, 
          password: senha 
        });

        
        localStorage.setItem("token", response.data.token);

        
        localStorage.setItem("aluno_nome", response.data.nome);

        onLoginSimulado("aluno");

      } else {
        
        if (!nome || !email || !senha) {
          return setErro("Preencha todos os campos");
        }

        const response = await api.post("/signup", { 
          nome: nome, 
          email: email, 
          password: senha 
        });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("aluno_nome", response.data.usuario.nome);

        onLoginSimulado("aluno");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErro(error.response.data.mensagem);
      } else {
        setErro("Erro de conexão.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center p-4">
      <img src={orfeuImg} alt="Logo ORFEU" width="300px" className="m-6" />
      
      <div className="w-full max-w-md bg-zinc-900 border border-brand-card/30 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8 text-brand-light text-2xl font-semibold">
          {isLogin ? "Login" : "Criar sua Conta"}
        </div>

        {erro && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 text-sm p-3 rounded-lg mb-6 text-center">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {!isLogin && (
            <div>
              <label className="block text-sm text-brand-light mb-2">Nome Completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-3 bg-brand-light border border-brand-card rounded-lg text-brand-dark"
                placeholder="Ex: João da Silva"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-brand-light mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-brand-light border border-brand-card rounded-lg text-brand-dark"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-brand-light mb-2">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 bg-brand-light border border-brand-card rounded-lg text-brand-dark"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-semibold text-brand-dark bg-brand-primary hover:bg-amber-500 rounded-lg transition-colors"
          >
            {isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>


        <div className="mt-8 text-center border-t border-brand-card/30 pt-6">
          <p className="text-brand-light text-sm mb-2">
            {isLogin ? "Ainda não tem uma conta?" : "Já possui uma conta?"}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErro("");
            }}
            className="text-brand-primary font-semibold hover:underline"
          >
            {isLogin ? "Cadastre-se no ORFEU" : "Faça login"}
          </button>
        </div>

      </div>
    </div>
  );
}