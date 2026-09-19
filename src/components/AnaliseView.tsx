import React, { useState } from 'react';
import {
  BarChart3,
  Flame,
  Clock,
  Grid,
  TrendingUp,
  Percent,
  Layers,
  ArrowUpDown,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { ComprehensiveAnalysis } from '../services/statisticalEngine';
import { PeriodoAnalise } from '../types';
import { formatTwoDigits } from '../data/bichoData';

interface AnaliseViewProps {
  analysis: ComprehensiveAnalysis;
  periodo: PeriodoAnalise;
  onChangePeriodo: (p: PeriodoAnalise) => void;
}

export const AnaliseView: React.FC<AnaliseViewProps> = ({
  analysis,
  periodo,
  onChangePeriodo
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'grupos' | 'dezenas' | 'digitos' | 'quadrantes'>('grupos');
  const [selectedDezena, setSelectedDezena] = useState<string | null>(null);

  const selectedDezenaStat = selectedDezena
    ? analysis.dezenasStats.find(d => d.dezena === selectedDezena)
    : null;

  // Max group frequency for scaling bar widths
  const maxGroupAppearances = Math.max(...analysis.gruposStats.map(g => g.aparicoesTotais), 1);
  const maxGroupDelay = Math.max(...analysis.gruposStats.map(g => g.atraso), 1);

  return (
    <div className="space-y-6">
      {/* Control Header & Period Selector */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/80 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-emerald-400" />
              <span>MOTOR ESTATÍSTICO & VISUALIZAÇÕES</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Indicadores matemáticos de frequência, recência, repetição, atraso e distribuição harmônica.
            </p>
          </div>

          {/* Period Selection */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 px-2">Amostra:</span>
            {[
              { val: 10, label: 'Últimos 10' },
              { val: 20, label: 'Últimos 20' },
              { val: 50, label: 'Últimos 50' },
              { val: 100, label: 'Últimos 100' },
              { val: 9999, label: 'Toda a Base' },
            ].map(item => (
              <button
                key={item.val}
                onClick={() => onChangePeriodo(item.val as PeriodoAnalise)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  periodo === item.val
                    ? 'bg-emerald-500 text-black shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
          {[
            { id: 'grupos', label: 'Estatísticas dos 25 Grupos', icon: <Layers className="h-3.5 w-3.5" /> },
            { id: 'dezenas', label: 'Mapa de Calor das 100 Dezenas (00-99)', icon: <Grid className="h-3.5 w-3.5" /> },
            { id: 'digitos', label: 'Frequência Posicional dos Dígitos', icon: <Cpu className="h-3.5 w-3.5" /> },
            { id: 'quadrantes', label: 'Distribuição Par/Ímpar & Faixas', icon: <ArrowUpDown className="h-3.5 w-3.5" /> },
          ].map(sub => (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubTab === sub.id
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              {sub.icon}
              <span>{sub.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* VIEW: GRUPOS STATS */}
      {activeSubTab === 'grupos' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Frequência dos 25 Grupos */}
          <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Ranking de Frequência dos 25 Grupos</h3>
              </div>
              <span className="text-[11px] text-slate-400">Total de Aparições</span>
            </div>

            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {[...analysis.gruposStats]
                .sort((a, b) => b.aparicoesTotais - a.aparicoesTotais)
                .map((g, idx) => {
                  const percentWidth = Math.min(100, Math.round((g.aparicoesTotais / maxGroupAppearances) * 100));
                  return (
                    <div key={g.grupo} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400 text-xs">#{idx + 1}</span>
                          <span className="text-lg">{g.emoji}</span>
                          <span className="font-bold text-white">Grupo {formatTwoDigits(g.grupo)}</span>
                          <span className="text-slate-300 font-medium">({g.nome})</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-slate-400 text-[11px]">Dezenas: {g.dezenas.join(', ')}</span>
                          <span className="font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                            {g.aparicoesTotais}x ({g.frequenciaPercentual}%)
                          </span>
                        </div>
                      </div>

                      {/* Visual Bar */}
                      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                          style={{ width: `${percentWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Ciclo de Atraso dos 25 Grupos */}
          <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Ciclos de Atraso dos 25 Grupos</h3>
              </div>
              <span className="text-[11px] text-slate-400">Sorteios sem Sair</span>
            </div>

            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {[...analysis.gruposStats]
                .sort((a, b) => b.atraso - a.atraso)
                .map((g, idx) => {
                  const percentWidth = Math.min(100, Math.round((g.atraso / maxGroupDelay) * 100));
                  return (
                    <div key={g.grupo} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400 text-xs">#{idx + 1}</span>
                          <span className="text-lg">{g.emoji}</span>
                          <span className="font-bold text-white">Grupo {formatTwoDigits(g.grupo)}</span>
                          <span className="text-slate-300 font-medium">({g.nome})</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="font-bold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                            {g.atraso} {g.atraso === 1 ? 'sorteio' : 'sorteios'} de atraso
                          </span>
                        </div>
                      </div>

                      {/* Visual Bar */}
                      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-400"
                          style={{ width: `${percentWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: 100 DEZENAS HEATMAP */}
      {activeSubTab === 'dezenas' && (
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Grid className="h-5 w-5 text-emerald-400" />
                <span>Mapa de Calor Interativo das 100 Dezenas (00 a 99)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Clique em qualquer dezena para inspecionar frequência, atraso, grupo correspondente e bicho.
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-rose-500" />
                <span className="text-slate-300">Quente</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-emerald-500" />
                <span className="text-slate-300">Média</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-slate-800" />
                <span className="text-slate-300">Fria / Atrasada</span>
              </div>
            </div>
          </div>

          {/* Selected Dezena Inspector Popover / Card */}
          {selectedDezenaStat && (
            <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-mono text-xl font-black">
                  {selectedDezenaStat.dezena}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    Dezena {selectedDezenaStat.dezena} — Grupo {formatTwoDigits(selectedDezenaStat.grupo)} ({selectedDezenaStat.nomeBicho})
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                    <span>Aparições Totais: <strong className="text-emerald-400 font-mono">{selectedDezenaStat.aparicoesTotais}x</strong></span>
                    <span>1º Prêmio: <strong className="text-emerald-400 font-mono">{selectedDezenaStat.aparicoesPrimeiroPremio}x</strong></span>
                    <span>Atraso: <strong className="text-amber-400 font-mono">{selectedDezenaStat.atraso} sorteios</strong></span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Score Estatístico:</span>
                <span className="text-sm font-bold font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-lg">
                  {selectedDezenaStat.scoreEstatistico} pts
                </span>
              </div>
            </div>
          )}

          {/* 10x10 Heatmap Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {analysis.dezenasStats.map(d => {
              const isHot = d.isQuente;
              const isCold = d.isFrio || d.isAtrasado;
              const isSelected = selectedDezena === d.dezena;

              let bgClass = 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-600';
              if (isHot) {
                bgClass = 'bg-rose-950/40 text-rose-300 border-rose-500/40 hover:bg-rose-900/50';
              } else if (d.aparicoesTotais > 0) {
                bgClass = 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/40';
              }

              if (isSelected) {
                bgClass += ' ring-2 ring-emerald-400 shadow-lg';
              }

              return (
                <button
                  key={d.dezena}
                  onClick={() => setSelectedDezena(d.dezena)}
                  className={`p-2 rounded-xl border text-center font-mono transition cursor-pointer ${bgClass}`}
                >
                  <div className="text-sm font-bold">{d.dezena}</div>
                  <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                    {d.aparicoesTotais}x
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: DIGITOS POSICIONAIS */}
      {activeSubTab === 'digitos' && (
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-6 shadow-xl">
          <div className="pb-4 border-b border-slate-800 mb-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="h-5 w-5 text-amber-400" />
              <span>Frequência Posicional de Dígitos (0 a 9) na Milhar</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Contagem e distribuição de dígitos na 1ª posição (milhar), 2ª (centena), 3ª (dezena) e 4ª (unidade).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { pos: 1, label: '1º Dígito (Milhar)' },
              { pos: 2, label: '2º Dígito (Centena)' },
              { pos: 3, label: '3º Dígito (Dezena)' },
              { pos: 4, label: '4º Dígito (Unidade)' },
            ].map(col => {
              const sortedDigits = [...analysis.digitosPosicionais].sort((a, b) => {
                const va = col.pos === 1 ? a.pos1 : col.pos === 2 ? a.pos2 : col.pos === 3 ? a.pos3 : a.pos4;
                const vb = col.pos === 1 ? b.pos1 : col.pos === 2 ? b.pos2 : col.pos === 3 ? b.pos3 : b.pos4;
                return vb - va;
              });

              return (
                <div key={col.pos} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                    {col.label}
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    {sortedDigits.map((d, idx) => {
                      const count = col.pos === 1 ? d.pos1 : col.pos === 2 ? d.pos2 : col.pos === 3 ? d.pos3 : d.pos4;
                      return (
                        <div key={d.digito} className="flex items-center justify-between p-1.5 rounded bg-slate-800/40">
                          <span className="font-mono font-bold text-white">Dígito {d.digito}</span>
                          <span className="font-mono text-slate-300 text-[11px] bg-slate-900 px-2 py-0.5 rounded">
                            {count} aparições
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: QUADRANTES & DISTRIBUIÇÃO */}
      {activeSubTab === 'quadrantes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4">Equilíbrio Par vs. Ímpar</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Números Pares</span>
                  <span>{analysis.distribuicaoParImpar.pares} ({analysis.distribuicaoParImpar.percentualPares}%)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${analysis.distribuicaoParImpar.percentualPares}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Números Ímpares</span>
                  <span>{analysis.distribuicaoParImpar.impares} ({analysis.distribuicaoParImpar.percentualImpares}%)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500"
                    style={{ width: `${analysis.distribuicaoParImpar.percentualImpares}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4">Faixas Numéricas (00-49 vs 50-99)</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Baixos (00 - 49)</span>
                  <span>{analysis.distribuicaoAltosBaixos.baixos} ({analysis.distribuicaoAltosBaixos.percentualBaixos}%)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${analysis.distribuicaoAltosBaixos.percentualBaixos}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Altos (50 - 99)</span>
                  <span>{analysis.distribuicaoAltosBaixos.altos} ({analysis.distribuicaoAltosBaixos.percentualAltos}%)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${analysis.distribuicaoAltosBaixos.percentualAltos}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
