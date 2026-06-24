import { useState, useRef, useEffect } from 'react';
import { User, Mail, Guitar, GraduationCap, Phone, Edit2, Check, X, Camera } from 'lucide-react';
import xboxico from "../../assets/xboxico.jpg";
import api from "../../services/api";

export default function PerfilAluno() {
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [aluno, setAluno] = useState({
    nome: "",
    email: "",
    telefone: "",
    bio: "",
    avatar_url: null
  });

  const [telefoneEdit, setTelefoneEdit] = useState("");
  const [bioEdit, setBioEdit] = useState("");
  const [arquivoFoto, setArquivoFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);

  useEffect(() => {
    api.get("/perfil")
      .then((response) => {
        const dados = response.data;
        setAluno(prev => ({
          ...prev,
          nome: dados.nome || "",
          email: dados.email || "",
          telefone: dados.telefone || "",
          bio: dados.bio || "",
          avatar_url: dados.avatar_url ? `http://localhost:3000/uploads/${dados.avatar_url}` : null
        }));
        setTelefoneEdit(dados.telefone || "");
        setBioEdit(dados.bio || "");
      })
      .catch((error) => console.error(error));
  }, []);

  const handleSalvar = async () => {
    try {
      const formData = new FormData();
      formData.append("telefone", telefoneEdit);
      formData.append("bio", bioEdit);
      if (arquivoFoto) {
        formData.append("avatar", arquivoFoto);
      }

      const response = await api.put("/perfil", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setAluno((prev) => ({
        ...prev,
        telefone: telefoneEdit,
        bio: bioEdit,
        avatar_url: response.data.avatar_url 
          ? `http://localhost:3000/uploads/${response.data.avatar_url}` 
          : prev.avatar_url
      }));

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelar = () => {
    setTelefoneEdit(aluno.telefone);
    setBioEdit(aluno.bio);
    setArquivoFoto(null);
    setPreviewFoto(null);
    setIsEditing(false);
  };

  const handleFotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArquivoFoto(file);
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const fotoExibicao = previewFoto || aluno.avatar_url || xboxico;

  return (
    <div className='flex justify-center items-center min-h-full'>
      <div className='bg-brand-dark text-brand-light w-full max-w-xl border border-brand-card/20 rounded-2xl flex flex-col items-center p-8 gap-4 relative'>

        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-6 right-6 p-2 text-brand-card hover:text-brand-primary transition"
          >
            <Edit2 size={20} />
          </button>
        ) : (
          <div className="absolute top-6 right-6 flex gap-2">
            <button 
              onClick={handleCancelar}
              className="p-2 text-red-400 hover:text-red-300 transition bg-red-400/10 rounded-lg"
            >
              <X size={20} />
            </button>
            <button 
              onClick={handleSalvar}
              className="p-2 text-emerald-400 hover:text-emerald-300 transition bg-emerald-400/10 rounded-lg"
            >
              <Check size={20} />
            </button>
          </div>
        )}

        <div className='flex flex-col items-center align-center gap-2 relative'>
          <div 
            className={`relative group ${isEditing ? 'cursor-pointer' : ''}`}
            onClick={() => isEditing && fileInputRef.current.click()}
          >
            <img 
              src={fotoExibicao} 
              alt="icone aluno" 
              className={`border border-brand-card/30 w-32 h-32 object-cover rounded-2xl ${isEditing ? 'opacity-50' : ''}`}
            />
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="text-brand-light" size={32} />
              </div>
            )}
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFotoChange}
          />
          <h3 className='text-2xl text-brand-light'>{aluno.nome.split(" ")[0]}</h3>
        </div>

        <div className='w-full space-y-4'>
          <div className='flex gap-2 items-center'>
            <User className='text-brand-primary shrink-0'/>
            <p className='text-brand-primary font-medium hidden sm:inline'>Nome:</p>
            <p className='text-brand-light'>{aluno.nome}</p>
          </div>

          <div className='flex gap-2 items-center'>
            <Phone className='text-brand-primary shrink-0'/>
            <p className='text-brand-primary font-medium hidden sm:inline'>Telefone:</p>
            {isEditing ? (
              <input 
                type="text" 
                value={telefoneEdit}
                onChange={(e) => setTelefoneEdit(e.target.value)}
                className="bg-brand-card/10 border border-brand-card/50 text-brand-light px-2 py-1 rounded w-full"
              />
            ) : (
              <p className=''>{aluno.telefone}</p>
            )}
          </div>

          <div className='flex gap-2 items-center'>
            <Mail className='text-brand-primary shrink-0'/>
            <p className='text-brand-primary font-medium hidden sm:inline'>E-mail:</p>
            <p className=''>{aluno.email}</p>
          </div>

          <div className='flex gap-2 items-start shrink-0'>
            <Guitar className='text-brand-primary mt-1'/>
            <p className='text-brand-primary mt-1'>Bio:</p>
            {isEditing ? (
              <textarea 
                value={bioEdit}
                onChange={(e) => setBioEdit(e.target.value)}
                className="bg-brand-card/10 border border-brand-card/50 text-brand-light px-2 py-1 rounded w-full min-h-20"
              />
            ) : (
              <p className='mt-1'>{aluno.bio}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}