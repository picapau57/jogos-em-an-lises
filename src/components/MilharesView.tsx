import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  Layers,
  Cpu,
  BarChart2,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { ComprehensiveAnalysis } from '../services/statisticalEngine';
import {
  generateMilhares,
  MilharMode
} from '../services/combinationGenerator';
import {
  GeneratedCombination,
  AdvancedFilters,
  StatisticalWeights
} from '../types';
import { ResultsPanel } from './ResultsPanel';

interface MilharesViewProps {
  analysis: ComprehensiveAnalysis;
  weights: StatisticalWeights;
  initialCombinations?: GeneratedCombination[];
}

export const MilharesView: React.FC<MilharesViewProps> = ({
  analysis,
  weights,
  initialCombinations = []
}) => {
  const [quantity, setQuantity] = useState<number>(10);
  const [customQty, setCustomQty] = useState<string>('10');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [mode, setMode] = useState<MilharMode>('posicional');

  const [filters, setFilters] = useState<AdvancedFilters>({
    evitarRepetidosSessao: true,
    evitarConcentracaoGrupo: false,
    minQuentes: 0,
    maxQuentes: 4,
    minAtrasados: 0,
    maxAtrasados: 4,
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
      const generated = generateMilhares(
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                MILHARES
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  4 Dígitos (0000 a 9999)
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Geração estatística com preservação mandatória de zeros à esquerda e análise posicional de dígitos (1º ao 4º).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Formato exato: <strong className="text-amber-300 font-mono">0472</strong> ou <strong className="text-amber-300 font-mono">0047</strong></span>
          </div>
        </div>

        {/* Positional Digit Frequency Breakdown Bar */}
        <div className="mt-5 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BarChart2 className="h-3.5 w-3.5 text-amber-400" />
            <span>Dígitos Mais Frequentes por Posição Histórica (1º Prêmio)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[1, 2, 3, 4].map(pos => {
              const topDigit = [...analysis.digitosPosicionais].sort((a, b) => {
                const va = pos === 1 ? a.pos1 : pos === 2 ? a.pos2 : pos === 3 ? a.pos3 : a.pos4;
                const vb = pos === 1 ? b.pos1 : pos === 2 ? b.pos2 : pos === 3 ? b.pos3 : b.pos4;
                return vb - va;
              })[0];
              return (
                <div key={pos} className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">{pos}º Dígito:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {topDigit ? topDigit.digito : '0'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Generator Controls */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quantity */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Quantidade de Milhares
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[5, 10, 15, 20, 30, 40, 50].map(qty => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => handleSelectQuantity(qty)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                    !isCustom && quantity === qty
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
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
                    ? 'bg-amber-500 text-black ring-1 ring-amber-400'
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
                  className="w-28 rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
                <span className="text-xs text-slate-400">máx. 100</span>
              </div>
            )}
          </div>

          {/* Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Método de Geração
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'posicional', label: 'Posicional Top', desc: 'Dígitos de alta freq.', icon: <Cpu className="h-3.5 w-3.5 text-amber-400" /> },
                { id: 'quente', label: 'Dezena Quente', desc: 'Final com dezena quente', icon: <Flame className="h-3.5 w-3.5 text-rose-400" /> },
                { id: 'atrasada', label: 'Ciclo Atrasado', desc: 'Dígitos menos frequentes', icon: <Layers className="h-3.5 w-3.5 text-cyan-400" /> },
                { id: 'balanceada', label: 'Balanceada', desc: 'Distribuição simétrica', icon: <BarChart2 className="h-3.5 w-3.5 text-emerald-400" /> },
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id as MilharMode)}
                  className={`p-2 rounded-xl text-left border transition cursor-pointer ${
                    mode === m.id
                      ? 'bg-amber-500/15 border-amber-500/60 text-white ring-1 ring-amber-500/30'
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
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                <span>Zero à Esquerda Garantido</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Todas as milhares mantêm 4 dígitos estritos (ex: <span className="font-mono text-amber-300">0047</span>, nunca 47).
              </div>
            </div>

            <div className="mt-4">
              <button
                id="btn-generate-milhares"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold text-sm tracking-wide shadow-xl shadow-amber-500/20 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'CALCULANDO MILHARES...' : 'GERAR MILHARES'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ResultsPanel
        combinations={combinations}
        title="MILHARES GERADAS"
        onClear={() => setCombinations([])}
        onRegenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
};
