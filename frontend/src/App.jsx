import "./App.css";
import { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Menu, X } from "lucide-react";
import Login from "./pages/login/Login";
import Sidebar from "./components/Sidebar";
import VisaoGeralAluno from "./pages/aluno/VisaoGeralAluno";
import Biblioteca from "./pages/aluno/Biblioteca";
import Praticar from "./pages/aluno/Praticar";
import PerfilAluno from "./pages/aluno/PerfilAluno";

//falta adicionar a tela do professor

function App() {
    const [usuarioLogado, setUsuarioLogado] = useState(() =>
        localStorage.getItem("token") ? "aluno" : null,
    );
    const [menuAberto, setMenuAberto] = useState(false);

    const [minutosPraticados, setMinutosPraticados] = useState(90);

    const handleTimerExpire = () => {
        setMinutosPraticados((minutosAtuais) => minutosAtuais + 30);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUsuarioLogado(null);
        setMenuAberto(false);
    };

    if (!usuarioLogado) {
        return <Login onLoginSimulado={setUsuarioLogado} />;
    }

    return (
        <Router>
            <div className="flex min-h-screen bg-brand-light text-brand-dark relative">
                <button
                    onClick={() => setMenuAberto(!menuAberto)}
                    className="fixed top-4 left-2 z-50 p-2 bg-brand-dark border border-brand-card/70 rounded-xl md:hidden"
                >
                    {menuAberto ? (
                        <X color="#FBFFFE" size={24} />
                    ) : (
                        <Menu color="#FBFFFE" size={24} />
                    )}
                </button>

                <Sidebar onLogout={handleLogout} menuAberto={setMenuAberto} />

                <main className="flex-1 p-4 overflow-y-auto pt-18 md:pt-4">
                    <Routes>
                        <Route
                            path="/"
                            element={<Navigate to="/visao-geral" replace />}
                        />

                        <Route
                            path="/visao-geral"
                            element={
                                <VisaoGeralAluno
                                    minutosPraticados={minutosPraticados}
                                />
                            }
                        />
                        <Route path="/biblioteca" element={<Biblioteca />} />
                        <Route
                            path="/praticar"
                            element={
                                <Praticar onTimerExpire={handleTimerExpire} />
                            }
                        />
                        <Route path="/perfil" element={<PerfilAluno />} />

                        <Route
                            path="*"
                            element={<Navigate to="/visao-geral" replace />}
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
