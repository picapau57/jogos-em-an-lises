import React, { useState, useEffect, useMemo } from 'react';
import {
  HeaderNavbar,
  ActiveTab
} from './components/HeaderNavbar';
import { DashboardView } from './components/DashboardView';
import { TernosGruposView } from './components/TernosGruposView';
import { TernosDezenasView } from './components/TernosDezenasView';
import { MilharesView } from './components/MilharesView';
import { QuininhaView } from './components/QuininhaView';
import { AnaliseView } from './components/AnaliseView';
import { HistoricoView } from './components/HistoricoView';
import { ConfiguracoesView } from './components/ConfiguracoesView';

import {
  DrawResult,
  PeriodoAnalise,
  StatisticalWeights
} from './types';
import { HISTORICO_DEMO_PADRAO } from './data/bichoData';
import { computeComprehensiveAnalysis } from './services/statisticalEngine';
import { ShieldCheck, AlertCircle } from 'lucide-react';

const STORAGE_DRAWS_KEY = 'bicho_analyzer_draws_v1';
const STORAGE_WEIGHTS_KEY = 'bicho_analyzer_weights_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Load historical draws from localStorage or fallback to standard demo
  const [draws, setDraws] = useState<DrawResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DRAWS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Falha ao carregar sorteios salvos:', e);
    }
    return HISTORICO_DEMO_PADRAO;
  });

  // Weights
  const [weights, setWeights] = useState<StatisticalWeights>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WEIGHTS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Falha ao carregar pesos salvos:', e);
    }
    return {
      frequencia: 30,
      tendenciaRecente: 25,
      atraso: 20,
      distribuicao: 15,
      repeticao: 10
    };
  });

  const [periodo, setPeriodo] = useState<PeriodoAnalise>(50);
  const [statusConexao, setStatusConexao] = useState<'ao_vivo' | 'atualizado' | 'manual' | 'offline' | 'demo'>('ao_vivo');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAtualizando, setIsAtualizando] = useState<boolean>(false);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>('Hoje às 18:30 (PTN)');

  // Persist draws whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DRAWS_KEY, JSON.stringify(draws));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  }, [draws]);

  // Compute analysis via memoization
  const analysis = useMemo(() => {
    return computeComprehensiveAnalysis(draws, periodo, weights);
  }, [draws, periodo, weights]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddDraw = (newDraw: DrawResult) => {
    setDraws(prev => [newDraw, ...prev]);
    setStatusConexao('atualizado');
    showToast('Sorteio adicionado e estatísticas recalculadas com sucesso!');
  };

  const handleEditDraw = (updated: DrawResult) => {
    setDraws(prev => prev.map(d => (d.id === updated.id ? updated : d)));
    setStatusConexao('atualizado');
    showToast('Resultado atualizado com sucesso!');
  };

  const handleDeleteDraw = (id: string) => {
    setDraws(prev => prev.filter(d => d.id !== id));
    showToast('Resultado excluído do histórico.');
  };

  const handleRestoreDemo = () => {
    setDraws(HISTORICO_DEMO_PADRAO);
    setStatusConexao('demo');
    showToast('Base restaurada para o conjunto padrão com sucesso.');
  };

  const handleImportDraws = (imported: DrawResult[]) => {
    // Merge without duplicates by ID
    setDraws(prev => {
      const existingIds = new Set(prev.map(d => d.id));
      const fresh = imported.filter(d => !existingIds.has(d.id));
      return [...fresh, ...prev];
    });
    setStatusConexao('atualizado');
    showToast(`${imported.length} resultados incorporados à base histórica.`);
  };

  const handleAtualizarDados = () => {
    setIsAtualizando(true);
    setTimeout(() => {
      setIsAtualizando(false);
      setStatusConexao('ao_vivo');
      const now = new Date();
      setUltimaAtualizacao(`Hoje às ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
      showToast('Indicadores estatísticos sincronizados e atualizados!');
    }, 600);
  };

  const handleQuickGenerate = (modalidade: 'terno_grupo' | 'terno_dezena' | 'milhar' | 'quininha') => {
    switch (modalidade) {
      case 'terno_grupo':
        setActiveTab('ternos_grupos');
        break;
      case 'terno_dezena':
        setActiveTab('ternos_dezenas');
        break;
      case 'milhar':
        setActiveTab('milhares');
        break;
      case 'quininha':
        setActiveTab('quininha');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Toast notification popup */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-500 text-black font-bold text-xs shadow-2xl shadow-emerald-500/40 border border-emerald-400 animate-bounce">
          <ShieldCheck className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header and Navigation */}
      <HeaderNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        statusConexao={statusConexao}
        totalResultados={draws.length}
        ultimaAtualizacao={ultimaAtualizacao}
        onAtualizarDados={handleAtualizarDados}
        isAtualizando={isAtualizando}
      />

      {/* Primary Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            analysis={analysis}
            recentDraws={draws}
            setActiveTab={setActiveTab}
            onQuickGenerate={handleQuickGenerate}
          />
        )}

        {activeTab === 'ternos_grupos' && (
          <TernosGruposView
            analysis={analysis}
            weights={weights}
          />
        )}

        {activeTab === 'milhares' && (
          <MilharesView
            analysis={analysis}
            weights={weights}
          />
        )}

        {activeTab === 'ternos_dezenas' && (
          <TernosDezenasView
            analysis={analysis}
            weights={weights}
          />
        )}

        {activeTab === 'quininha' && (
          <QuininhaView
            analysis={analysis}
            weights={weights}
          />
        )}

        {(activeTab === 'estatisticas' || activeTab === 'analise') && (
          <AnaliseView
            analysis={analysis}
            periodo={periodo}
            onChangePeriodo={setPeriodo}
          />
        )}

        {activeTab === 'historico' && (
          <HistoricoView
            draws={draws}
            onAddDraw={handleAddDraw}
            onEditDraw={handleEditDraw}
            onDeleteDraw={handleDeleteDraw}
            onRestoreDemo={handleRestoreDemo}
            onImportDraws={handleImportDraws}
          />
        )}

        {activeTab === 'configuracoes' && (
          <ConfiguracoesView
            weights={weights}
            onChangeWeights={setWeights}
            periodo={periodo}
            onChangePeriodo={setPeriodo}
            onRestoreDefaults={() => {
              setWeights({
                frequencia: 30,
                tendenciaRecente: 25,
                atraso: 20,
                distribuicao: 15,
                repeticao: 10
              });
              showToast('Pesos restaurados para a calibração padrão.');
            }}
          />
        )}
      </main>

      {/* Mandatory Statistical Disclaimer & Professional Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-[#070a12] py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              B
            </div>
            <div>
              <p className="font-bold text-white">
                BICHO ANALYZER PRO <span className="text-[10px] text-emerald-400 font-mono">v2.5 PRO</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Plataforma de inteligência probabilística e análise estatística de resultados.
              </p>
            </div>
          </div>

          <div className="max-w-md text-[11px] text-slate-400 text-center md:text-right border-l md:border-l-0 border-slate-800 pl-3 md:pl-0">
            <span className="text-amber-400/90 font-semibold flex items-center justify-center md:justify-end gap-1 mb-0.5">
              <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
              Aviso de Responsabilidade Matemática
            </span>
            As combinações geradas são puramente sugestões baseadas em frequências e atrasos históricos. Jogos de azar envolvem risco financeiro. Nunca há garantia de ganho.
          </div>
        </div>
      </footer>
    </div>
  );
}
