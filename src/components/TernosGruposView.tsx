import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Sliders,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';
import { ComprehensiveAnalysis } from '../services/statisticalEngine';
import {
  generateTernosDeGrupos,
  TernoGrupoMode
} from '../services/combinationGenerator';
import {
  GeneratedCombination,
  AdvancedFilters,
  StatisticalWeights
} from '../types';
import { ResultsPanel } from './ResultsPanel';
import { formatTwoDigits } from '../data/bichoData';

interface TernosGruposViewProps {
  analysis: ComprehensiveAnalysis;
  weights: StatisticalWeights;
  initialCombinations?: GeneratedCombination[];
}

export const TernosGruposView: React.FC<TernosGruposViewProps> = ({
  analysis,
  weights,
  initialCombinations = []
}) => {
  const [quantity, setQuantity] = useState<number>(10);
  const [customQty, setCustomQty] = useState<string>('10');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [mode, setMode] = useState<TernoGrupoMode>('score');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [filters, setFilters] = useState<AdvancedFilters>({
    evitarRepetidosSessao: true,
    evitarConcentracaoGrupo: false,
    minQuentes: 0,
    maxQuentes: 3,
    minAtrasados: 0,
    maxAtrasados: 3,
    equilibrarParImpar: false,
    equilibrarAltosBaixos: false
  });

  const [combinations, setCombinations] = useState<GeneratedCombination[]>(initialCombinations);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleSelectQuantity = (qty: number) => {
    setIsCustom(false);
    setQuantity(qty);
  };

  const handleCustomQuantityChange = (val: string) => {
    setCustomQty(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setQuantity(Math.min(100, Math.max(1, parsed)));
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateTernosDeGrupos(
        analysis,
        quantity,
        mode,
        filters,
        weights
      );
      setCombinations(generated);
      setIsGenerating(false);
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Description */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/80 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                TERNOS DE GRUPOS
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  Grupos 01 a 25
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Gere combinações de 3 grupos distintos ordenados em ordem crescente com base em modelos de frequência e atraso.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Formato exato: <strong className="text-emerald-300 font-mono">01 - 07 - 23</strong></span>
          </div>
        </div>

        {/* Generator Controls */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Quantity Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Quantidade de Combinações
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[5, 10, 15, 20, 30, 40, 50].map(qty => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => handleSelectQuantity(qty)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                    !isCustom && quantity === qty
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {qty}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isCustom
                    ? 'bg-emerald-500 text-black ring-1 ring-emerald-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                }`}
              >
                Outra
              </button>
            </div>

            {isCustom && (
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={customQty}
                  onChange={e => handleCustomQuantityChange(e.target.value)}
                  placeholder="Qtd (1-100)"
                  className="w-28 rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-xs text-slate-400">máx. 100 por lote</span>
              </div>
            )}
          </div>

          {/* Column 2: Generation Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Modo de Geração
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'score', label: 'Estatístico (Geral)', desc: 'Score ponderado' },
                { id: 'quentes', label: 'Grupos Quentes', desc: 'Maior frequência' },
                { id: 'atrasados', label: 'Mais Atrasados', desc: 'Ciclo de atraso' },
                { id: 'misto', label: 'Misto (Quente+Atraso)', desc: 'Combinação mista' },
                { id: 'balanceado', label: 'Balanceado', desc: 'Faixas 01-25 distribuídas' },
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id as TernoGrupoMode)}
                  className={`p-2 rounded-xl text-left border transition cursor-pointer ${
                    mode === m.id
                      ? 'bg-emerald-500/15 border-emerald-500/60 text-white ring-1 ring-emerald-500/30'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className="text-[10px] text-slate-400">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Prominent Generation Button & Filters toggle */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Filtros Opcionais</span>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span>{showFilters ? 'Recolher Filtros' : 'Ajustar Filtros'}</span>
                  {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>

              <div className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Anti-Duplicação Ativo</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Garante combinações únicas sem repetição de grupos no mesmo jogo.
                </div>
              </div>
            </div>

            {/* GENERATE BUTTON */}
            <div className="mt-4">
              <button
                id="btn-generate-ternos-grupos"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-extrabold text-sm tracking-wide shadow-xl shadow-emerald-500/25 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'PROCESSANDO ANÁLISE...' : 'GERAR TERNOS DE GRUPOS'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-5 pt-5 border-t border-slate-800 bg-slate-900/40 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Filtros Avançados de Combinação
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.evitarRepetidosSessao}
                  onChange={e => setFilters({ ...filters, evitarRepetidosSessao: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                />
                <span>Evitar repetir jogos já gerados nesta sessão</span>
              </label>

              <div>
                <label className="block text-slate-400 mb-1">Mín. Grupos Quentes (0 a 3):</label>
                <select
                  value={filters.minQuentes}
                  onChange={e => setFilters({ ...filters, minQuentes: parseInt(e.target.value, 10) })}
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-2 py-1 text-white"
                >
                  <option value={0}>Sem mínimo</option>
                  <option value={1}>Mínimo 1</option>
                  <option value={2}>Mínimo 2</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Mín. Grupos Atrasados (0 a 3):</label>
                <select
                  value={filters.minAtrasados}
                  onChange={e => setFilters({ ...filters, minAtrasados: parseInt(e.target.value, 10) })}
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-2 py-1 text-white"
                >
                  <option value={0}>Sem mínimo</option>
                  <option value={1}>Mínimo 1</option>
                  <option value={2}>Mínimo 2</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.equilibrarParImpar}
                  onChange={e => setFilters({ ...filters, equilibrarParImpar: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                />
                <span>Equilibrar Grupos Pares e Ímpares</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Results Panel */}
      <ResultsPanel
        combinations={combinations}
        title="TERNOS DE GRUPOS GERADOS"
        onClear={() => setCombinations([])}
        onRegenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
};
