import React, { useState } from 'react';
import {
  Activity,
  BarChart3,
  Flame,
  Hash,
  Layers,
  Sparkles,
  History,
  Settings,
  RefreshCw,
  Menu,
  X,
  ShieldCheck,
  Zap,
  Grid
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'analise'
  | 'ternos_grupos'
  | 'ternos_dezenas'
  | 'milhares'
  | 'quininha'
  | 'historico'
  | 'estatisticas'
  | 'configuracoes';

interface HeaderNavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  statusConexao: 'ao_vivo' | 'atualizado' | 'manual' | 'offline' | 'demo';
  totalResultados: number;
  ultimaAtualizacao: string;
  onAtualizarDados: () => void;
  isAtualizando: boolean;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  activeTab,
  setActiveTab,
  statusConexao,
  totalResultados,
  ultimaAtualizacao,
  onAtualizarDados,
  isAtualizando
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getStatusBadge = () => {
    switch (statusConexao) {
      case 'ao_vivo':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider animate-pulse">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            AO VIVO
          </span>
        );
      case 'atualizado':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wider">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            ATUALIZADO
          </span>
        );
      case 'manual':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold tracking-wider">
            <span className="h-2 w-2 rounded-full bg-purple-400" />
            MANUAL
          </span>
        );
      case 'offline':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold tracking-wider">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            OFFLINE
          </span>
        );
      case 'demo':
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            DADOS DE DEMO
          </span>
        );
    }
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'DASHBOARD', icon: <Activity className="h-4 w-4" /> },
    { id: 'analise', label: 'ANÁLISE', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'ternos_grupos', label: 'TERNOS DE GRUPOS', icon: <Layers className="h-4 w-4" /> },
    { id: 'ternos_dezenas', label: 'TERNOS DE DEZENAS', icon: <Hash className="h-4 w-4" /> },
    { id: 'milhares', label: 'MILHARES', icon: <Flame className="h-4 w-4" /> },
    { id: 'quininha', label: 'QUININHA 13', icon: <Grid className="h-4 w-4" />, badge: '13D' },
    { id: 'historico', label: 'HISTÓRICO', icon: <History className="h-4 w-4" /> },
    { id: 'estatisticas', label: 'ESTATÍSTICAS', icon: <Zap className="h-4 w-4" /> },
    { id: 'configuracoes', label: 'CONFIGURAÇÕES', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0b0f19]/95 backdrop-blur-md">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between border-b border-slate-900">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-black shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-300">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center">
                BICHO <span className="text-emerald-400 ml-1.5">ANALYZER</span>
                <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow">
                  PRO
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Inteligência Estatística & Gerador Profissional de Combinações
            </p>
          </div>
        </div>

        {/* Live Status and Action Button */}
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-2">
            {getStatusBadge()}
            <div className="text-[11px] text-slate-400 pl-1 border-l border-slate-800">
              <span className="text-slate-300 font-semibold">{totalResultados}</span> sorteios analisados
            </div>
            <div className="text-[10px] text-slate-400 pl-2">
              Atualizado: <span className="text-slate-300">{ultimaAtualizacao}</span>
            </div>
          </div>

          {/* UPDATE DATA BUTTON */}
          <button
            id="btn-update-data-header"
            onClick={onAtualizarDados}
            disabled={isAtualizando}
            title="Atualizar dados históricos locais ou sincronizar fonte configurada"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isAtualizando ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">ATUALIZAR DADOS</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 cursor-pointer"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden lg:flex items-center space-x-1 py-1.5 overflow-x-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    isActive ? 'bg-black/20 text-black' : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#0d1322] px-4 pt-2 pb-4 space-y-1">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
            <span>Status: {getStatusBadge()}</span>
            <span>{totalResultados} Sorteios</span>
          </div>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                  isActive
                    ? 'bg-emerald-500 text-black font-extrabold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
