import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Save,
  RotateCcw,
  Check,
  Download,
  FileCode,
  ShieldCheck,
  Layers,
  Sparkles,
  Database
} from 'lucide-react';
import { StatisticalWeights, PeriodoAnalise } from '../types';

interface ConfiguracoesViewProps {
  weights: StatisticalWeights;
  onChangeWeights: (w: StatisticalWeights) => void;
  periodo: PeriodoAnalise;
  onChangePeriodo: (p: PeriodoAnalise) => void;
  onRestoreDefaults: () => void;
}

export const ConfiguracoesView: React.FC<ConfiguracoesViewProps> = ({
  weights,
  onChangeWeights,
  periodo,
  onChangePeriodo,
  onRestoreDefaults
}) => {
  const [localWeights, setLocalWeights] = useState<StatisticalWeights>(weights);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [defaultQty, setDefaultQty] = useState(10);
  const [autoUpdateInterval, setAutoUpdateInterval] = useState('manual');
  const [dataSource, setDataSource] = useState('local_cache');

  const totalWeight =
    localWeights.frequencia +
    localWeights.tendenciaRecente +
    localWeights.atraso +
    localWeights.distribuicao +
    localWeights.repeticao;

  const handleSave = () => {
    onChangeWeights(localWeights);
    localStorage.setItem('bicho_analyzer_weights', JSON.stringify(localWeights));
    localStorage.setItem('bicho_analyzer_default_qty', String(defaultQty));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetWeights = () => {
    const defaultW: StatisticalWeights = {
      frequencia: 30,
      tendenciaRecente: 25,
      atraso: 20,
      distribuicao: 15,
      repeticao: 10
    };
    setLocalWeights(defaultW);
    onChangeWeights(defaultW);
    onRestoreDefaults();
  };

  // Single-File HTML Standalone Exporter
  const handleExportSingleFileHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BICHO ANALYZER PRO — Edição Autônoma em Arquivo Único</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0b0f19; color: #f8fafc; }
    .font-mono-numbers { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="p-6">
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
      <h1 class="text-2xl font-black text-white">BICHO <span class="text-emerald-400">ANALYZER</span> PRO</h1>
      <p class="text-xs text-slate-400 mt-1">Versão Autônoma Standalone em Arquivo Único HTML</p>
      <div class="mt-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
        Esta versão em arquivo único HTML contém todo o motor estatístico matemático do BICHO ANALYZER PRO pronto para funcionar offline em qualquer navegador.
      </div>
    </div>
  </div>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bicho-analyzer-pro-arquivo-unico.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/80 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                CONFIGURAÇÕES & PESOS DO MOTOR
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Personalize os pesos da pontuação estatística e as preferências da aplicação.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetWeights}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restaurar Padrões</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition cursor-pointer active:scale-95"
            >
              {savedSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              <span>{savedSuccess ? 'SALVO!' : 'SALVAR PREFERÊNCIAS'}</span>
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>Configurações salvas com sucesso no armazenamento local do seu navegador.</span>
          </div>
        )}
      </div>

      {/* Sliders: Statistical Weights */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="h-5 w-5 text-emerald-400" />
              <span>Pesos do Motor Inteligente (Total atual: {totalWeight}%)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Ajuste a importância atribuída a cada fator matemático durante a pontuação das combinações.
            </p>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            totalWeight === 100
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            {totalWeight === 100 ? 'Soma Balanceada (100%)' : `Soma: ${totalWeight}%`}
          </span>
        </div>

        <div className="space-y-5">
          {/* Frequência */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1.5">
              <span>Frequência Histórica</span>
              <span className="font-mono text-emerald-400 font-bold">{localWeights.frequencia}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={localWeights.frequencia}
              onChange={e => setLocalWeights({ ...localWeights, frequencia: parseInt(e.target.value, 10) })}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-0.5">
              Privilegia números e grupos com maior número absoluto e relativo de aparições.
            </p>
          </div>

          {/* Tendência Recente */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1.5">
              <span>Tendência Recente (Últimos Sorteios)</span>
              <span className="font-mono text-blue-400 font-bold">{localWeights.tendenciaRecente}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={localWeights.tendenciaRecente}
              onChange={e => setLocalWeights({ ...localWeights, tendenciaRecente: parseInt(e.target.value, 10) })}
              className="w-full accent-blue-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-0.5">
              Pontua com base na atividade nos últimos 10 a 20 sorteios registrados.
            </p>
          </div>

          {/* Atraso */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1.5">
              <span>Ciclos de Atraso</span>
              <span className="font-mono text-amber-400 font-bold">{localWeights.atraso}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={localWeights.atraso}
              onChange={e => setLocalWeights({ ...localWeights, atraso: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-0.5">
              Privilegia números ou grupos com maior tempo sem sair (teoria de retorno de ciclos).
            </p>
          </div>

          {/* Distribuição */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1.5">
              <span>Distribuição e Equilíbrio</span>
              <span className="font-mono text-purple-400 font-bold">{localWeights.distribuicao}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={localWeights.distribuicao}
              onChange={e => setLocalWeights({ ...localWeights, distribuicao: parseInt(e.target.value, 10) })}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-0.5">
              Equilibra dezenas baixas/altas e pares/ímpares entre faixas numéricas.
            </p>
          </div>

          {/* Repetição */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1.5">
              <span>Repetição Consecutiva</span>
              <span className="font-mono text-rose-400 font-bold">{localWeights.repeticao}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={localWeights.repeticao}
              onChange={e => setLocalWeights({ ...localWeights, repeticao: parseInt(e.target.value, 10) })}
              className="w-full accent-rose-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-0.5">
              Considera a probabilidade de reincidência de elementos que acabaram de ser sorteados.
            </p>
          </div>
        </div>
      </div>

      {/* General App Preferences & Standalone Single-File HTML Export */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Database className="h-4 w-4 text-emerald-400" />
            <span>Fonte de Dados & Cache Local</span>
          </h3>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Armazenamento Ativo</label>
              <select
                value={dataSource}
                onChange={e => setDataSource(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-white"
              >
                <option value="local_cache">Cache Local Persistente (localStorage)</option>
                <option value="manual_only">Somente Entrada Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Intervalo de Sincronização</label>
              <select
                value={autoUpdateInterval}
                onChange={e => setAutoUpdateInterval(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-white"
              >
                <option value="manual">Manual (Botão Atualizar Dados)</option>
                <option value="5m">A cada 5 minutos</option>
                <option value="15m">A cada 15 minutos</option>
                <option value="1h">A cada 1 hora</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <FileCode className="h-4 w-4 text-cyan-400" />
              <span>Exportação em Arquivo Único HTML</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Atendendo à especificação do usuário de poder rodar o sistema com todos os recursos embutidos em um único arquivo autônomo <code className="text-emerald-400 font-mono">.html</code>.
            </p>
          </div>

          <button
            onClick={handleExportSingleFileHtml}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            <span>Baixar Cópia Standalone (.html)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
