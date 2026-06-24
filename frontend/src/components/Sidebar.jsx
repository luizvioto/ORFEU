import orfeuImg from "../assets/orfeu.png";
import { NavLink } from "react-router-dom";
import {
    PanelsTopLeft,
    BookHeadphones,
    Metronome,
    MessageCircle,
    User,
    LogOut,
} from "lucide-react";

function Sidebar({ telaAtiva, setTelaAtiva, onLogout, menuAberto }) {
    const menuItems = [
        { path: "/visao-geral", label: "Visão Geral", icon: PanelsTopLeft },
        { path: "/biblioteca", label: "Biblioteca", icon: BookHeadphones },
        { path: "/praticar", label: "Praticar", icon: Metronome },
        { path: "/perfil", label: "Perfil", icon: User },
    ];

    return (
        <aside
            className={`
                fixed md:static top-0 left-0 z-40
                md:w-64 w-full min-h-screen bg-brand-dark 
                flex flex-col p-6 justify-between
                transition-transform duration-300 ease-in-out
                ${menuAberto ? "translate-x-0" : "-translate-x-full"} 
                md:translate-x-0
            `}
        >
            <div>
                <div className="flex item-center justify-center mb-8 pt-2">
                    <img src={orfeuImg} alt="Logo orfeu" className="h-10" />
                </div>
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icone = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setMenuAberto(false)}
                                className={({ isActive }) =>
                                    `w-full flex items-center px-4 py-3.5 gap-2 rounded-xl text-lg transition duration-150
                  ${
                      isActive
                          ? "bg-brand-primary text-brand-light"
                          : "hover:bg-brand-primary/50 text-brand-card hover:text-brand-light"
                  }`
                                }
                            >
                                <Icone color="#FFFFFF" size={24} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            <div className="pt-4 border-t border-brand-card/20">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium text-brand-card hover:bg-brand-accent/10 transition duration-150"
                >
                    <LogOut size={20} color="#FFFFFF" />
                    <span>Sair</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
