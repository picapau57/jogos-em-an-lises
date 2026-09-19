import React, { useState } from 'react';
import {
  Grid,
  Sparkles,
  TrendingUp,
  Clock,
  Shuffle,
  Scale,
  CheckCircle2
} from 'lucide-react';
import { ComprehensiveAnalysis } from '../services/statisticalEngine';
import {
  generateQuininha,
  QuininhaMode
} from '../services/combinationGenerator';
import {
  GeneratedCombination,
  AdvancedFilters,
  StatisticalWeights
} from '../types';
import { ResultsPanel } from './ResultsPanel';

interface QuininhaViewProps {
  analysis: ComprehensiveAnalysis;
  weights: StatisticalWeights;
  initialCombinations?: GeneratedCombination[];
}

export const QuininhaView: React.FC<QuininhaViewProps> = ({
  analysis,
  weights,
  initialCombinations = []
}) => {
  const [quantity, setQuantity] = useState<number>(5);
  const [customQty, setCustomQty] = useState<string>('5');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [mode, setMode] = useState<QuininhaMode>('balanced');

  const [filters, setFilters] = useState<AdvancedFilters>({
    evitarRepetidosSessao: true,
    evitarConcentracaoGrupo: false,
    minQuentes: 0,
    maxQuentes: 13,
    minAtrasados: 0,
    maxAtrasados: 13,
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
      setQuantity(Math.min(50, Math.max(1, parsed)));
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateQuininha(
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

  // Top 10 numbers preview from 01-80
  const topQuininhaNumbers = [...analysis.quininhaStats]
    .sort((a, b) => b.score - a.score)
    .slice(0, 13);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/80 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner">
              <Grid className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                QUININHA — 13 DEZENAS
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                  Dezenas 01 a 80
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Gere volantes completos de exatamente 13 dezenas ordenadas em ordem crescente com equilíbrio entre quadrantes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800">
            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
            <span>Exatamente <strong className="text-purple-300 font-mono">13 dezenas por jogo</strong></span>
          </div>
        </div>

        {/* Statistical Preview Before Generation */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>13 Dezenas Mais Bem Pontuadas no Score Atual (Faixa 01 - 80)</span>
            </span>
            <span className="text-[10px] text-slate-400">Pré-Visualização Estatística</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {topQuininhaNumbers.map(n => (
              <div
                key={n.numero}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 font-mono text-xs font-bold text-purple-300"
              >
                <span>{n.numero}</span>
                <span className="text-[9px] text-purple-400/80">({n.aparicoes}x)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Generator Controls */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quantity */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Quantidade de Jogos
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[3, 5, 10, 15, 20, 30].map(qty => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => handleSelectQuantity(qty)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                    !isCustom && quantity === qty
                      ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20 ring-1 ring-purple-400'
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
                    ? 'bg-purple-500 text-white ring-1 ring-purple-400'
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
                  max="50"
                  value={customQty}
                  onChange={e => handleCustomQuantityChange(e.target.value)}
                  placeholder="Qtd (1-50)"
                  className="w-28 rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
                <span className="text-xs text-slate-400">máx. 50</span>
              </div>
            )}
          </div>

          {/* Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Modo de Distribuição
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'balanced', label: 'BALANCED', desc: 'Distribuição em 4 quadrantes', icon: <Scale className="h-3.5 w-3.5 text-purple-400" /> },
                { id: 'frequency', label: 'FREQUENCY', desc: 'Foco em dezenas frequentes', icon: <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> },
                { id: 'delay', label: 'DELAY', desc: 'Foco em dezenas atrasadas', icon: <Clock className="h-3.5 w-3.5 text-amber-400" /> },
                { id: 'mixed', label: 'MIXED', desc: 'Harmonia entre freq e atraso', icon: <Shuffle className="h-3.5 w-3.5 text-cyan-400" /> },
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id as QuininhaMode)}
                  className={`p-2 rounded-xl text-left border transition cursor-pointer ${
                    mode === m.id
                      ? 'bg-purple-500/15 border-purple-500/60 text-white ring-1 ring-purple-500/30'
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

          {/* Action */}
          <div className="flex flex-col justify-between">
            <div className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
                <span>Formatação 2 Dígitos & Crescente</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Todas as 13 dezenas são estritamente distintas e ordenadas de 01 a 80.
              </div>
            </div>

            <div className="mt-4">
              <button
                id="btn-generate-quininha"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-purple-500/20 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'GERANDO VOLANTES...' : 'GERAR QUININHA (13 DEZENAS)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ResultsPanel
        combinations={combinations}
        title="JOGOS DE QUININHA (13 DEZENAS) GERADOS"
        onClear={() => setCombinations([])}
        onRegenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
};
