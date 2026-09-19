import React, { useState } from 'react';
import {
  Hash,
  Sparkles,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Flame,
  Snowflake,
  Shuffle,
  Scale
} from 'lucide-react';
import { ComprehensiveAnalysis } from '../services/statisticalEngine';
import {
  generateTernosDeDezenas,
  TernoDezenaMode
} from '../services/combinationGenerator';
import {
  GeneratedCombination,
  AdvancedFilters,
  StatisticalWeights
} from '../types';
import { ResultsPanel } from './ResultsPanel';

interface TernosDezenasViewProps {
  analysis: ComprehensiveAnalysis;
  weights: StatisticalWeights;
  initialCombinations?: GeneratedCombination[];
}

export const TernosDezenasView: React.FC<TernosDezenasViewProps> = ({
  analysis,
  weights,
  initialCombinations = []
}) => {
  const [quantity, setQuantity] = useState<number>(10);
  const [customQty, setCustomQty] = useState<string>('10');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [mode, setMode] = useState<TernoDezenaMode>('hot');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [filters, setFilters] = useState<AdvancedFilters>({
    evitarRepetidosSessao: true,
    evitarConcentracaoGrupo: true,
    minQuentes: 0,
    maxQuentes: 3,
    minAtrasados: 0,
    maxAtrasados: 3,
    equilibrarParImpar: true,
    equilibrarAltosBaixos: true
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
      const generated = generateTernosDeDezenas(
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
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/80 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner">
              <Hash className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                TERNOS DE DEZENAS
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                  Dezenas 00 a 99
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Combinações de 3 dezenas diferentes em ordem crescente com análise de frequência, atraso e faixas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Formato exato: <strong className="text-cyan-300 font-mono">07 - 34 - 81</strong></span>
          </div>
        </div>

        {/* Generator Controls */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quantity */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Quantidade de Ternos
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[5, 10, 15, 20, 30, 40, 50].map(qty => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => handleSelectQuantity(qty)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                    !isCustom && quantity === qty
                      ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
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
                    ? 'bg-cyan-500 text-black ring-1 ring-cyan-400'
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
                  className="w-28 rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
                <span className="text-xs text-slate-400">máx. 100</span>
              </div>
            )}
          </div>

          {/* Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Modo de Seleção
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'hot', label: 'HOT (Quentes)', desc: 'Maior frequência recente', icon: <Flame className="h-3.5 w-3.5 text-rose-400" /> },
                { id: 'cold', label: 'COLD (Frias)', desc: 'Maior atraso histórico', icon: <Snowflake className="h-3.5 w-3.5 text-cyan-400" /> },
                { id: 'mixed', label: 'MIXED (Misto)', desc: 'Quentes + Atrasadas', icon: <Shuffle className="h-3.5 w-3.5 text-amber-400" /> },
                { id: 'balanced', label: 'BALANCED', desc: 'Faixas 00-33, 34-66, 67-99', icon: <Scale className="h-3.5 w-3.5 text-emerald-400" /> },
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id as TernoDezenaMode)}
                  className={`p-2 rounded-xl text-left border transition cursor-pointer ${
                    mode === m.id
                      ? 'bg-cyan-500/15 border-cyan-500/60 text-white ring-1 ring-cyan-500/30'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {m.icon}
                    <span>{m.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Button & Filters Toggle */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Filtros Avançados</span>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span>{showFilters ? 'Recolher' : 'Ajustar'}</span>
                  {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>

              <div className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Validação Rigorosa</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Sem repetição de dezenas e sem concentração no mesmo animal/grupo.
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button
                id="btn-generate-ternos-dezenas"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-extrabold text-sm tracking-wide shadow-xl shadow-cyan-500/20 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'ANALISANDO DEZENAS...' : 'GERAR TERNOS DE DEZENAS'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-5 pt-5 border-t border-slate-800 bg-slate-900/40 p-4 rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.evitarConcentracaoGrupo}
                  onChange={e => setFilters({ ...filters, evitarConcentracaoGrupo: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Evitar concentração de dezenas no mesmo bicho</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.evitarRepetidosSessao}
                  onChange={e => setFilters({ ...filters, evitarRepetidosSessao: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Evitar repetições da sessão</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.equilibrarParImpar}
                  onChange={e => setFilters({ ...filters, equilibrarParImpar: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Equilibrar Pares e Ímpares (não permitir 3 iguais)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.equilibrarAltosBaixos}
                  onChange={e => setFilters({ ...filters, equilibrarAltosBaixos: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Equilibrar Baixas (00-49) e Altas (50-99)</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <ResultsPanel
        combinations={combinations}
        title="TERNOS DE DEZENAS GERADOS"
        onClear={() => setCombinations([])}
        onRegenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
};
