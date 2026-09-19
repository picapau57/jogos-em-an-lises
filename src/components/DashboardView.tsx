import React from 'react';
import {
  TrendingUp,
  Clock,
  Flame,
  Snowflake,
  Repeat,
  AlertCircle,
  ArrowRight,
  Sparkles,
  BarChart2,
  Calendar,
  Layers,
  Hash,
  Grid
} from 'lucide-react';
import { ComprehensiveAnalysis } from '../services/statisticalEngine';
import { DrawResult } from '../types';
import { getAnimalByGrupo, formatTwoDigits } from '../data/bichoData';
import { ActiveTab } from './HeaderNavbar';

interface DashboardViewProps {
  analysis: ComprehensiveAnalysis;
  recentDraws: DrawResult[];
  setActiveTab: (tab: ActiveTab) => void;
  onQuickGenerate: (modalidade: 'terno_grupo' | 'terno_dezena' | 'milhar' | 'quininha') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  analysis,
  recentDraws,
  setActiveTab,
  onQuickGenerate
}) => {
  const latestDraw = recentDraws[0];

  return (
    <div className="space-y-6">
      {/* Welcome & Overview Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#07131e] p-6 shadow-2xl">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Painel de Inteligência Estatística Ativado</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Análise Preditiva & Métricas do Jogo do Bicho
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Base calculada com <span className="font-semibold text-emerald-400">{analysis.totalSorteiosAnalisados} sorteios históricos</span>.
              Identifique padrões de frequência, ciclos de atraso e gere combinações inteligentes com filtragem matemática avançada.
            </p>
          </div>

          {/* Quick Action Buttons for 4 Modalities */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => onQuickGenerate('terno_grupo')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-500 hover:text-black text-slate-200 border border-slate-700 hover:border-emerald-400 transition shadow-lg group cursor-pointer"
            >
              <Layers className="h-5 w-5 text-emerald-400 group-hover:text-black mb-1.5 transition" />
              <span className="text-xs font-bold text-center">Ternos Grupos</span>
              <span className="text-[10px] text-slate-400 group-hover:text-black/80 font-medium">3 Grupos</span>
            </button>

            <button
              onClick={() => onQuickGenerate('terno_dezena')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-500 hover:text-black text-slate-200 border border-slate-700 hover:border-emerald-400 transition shadow-lg group cursor-pointer"
            >
              <Hash className="h-5 w-5 text-emerald-400 group-hover:text-black mb-1.5 transition" />
              <span className="text-xs font-bold text-center">Ternos Dezenas</span>
              <span className="text-[10px] text-slate-400 group-hover:text-black/80 font-medium">3 Dezenas</span>
            </button>

            <button
              onClick={() => onQuickGenerate('milhar')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-500 hover:text-black text-slate-200 border border-slate-700 hover:border-emerald-400 transition shadow-lg group cursor-pointer"
            >
              <Flame className="h-5 w-5 text-amber-400 group-hover:text-black mb-1.5 transition" />
              <span className="text-xs font-bold text-center">Milhares</span>
              <span className="text-[10px] text-slate-400 group-hover:text-black/80 font-medium">4 Dígitos</span>
            </button>

            <button
              onClick={() => onQuickGenerate('quininha')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-500 hover:text-black text-slate-200 border border-slate-700 hover:border-emerald-400 transition shadow-lg group cursor-pointer"
            >
              <Grid className="h-5 w-5 text-purple-400 group-hover:text-black mb-1.5 transition" />
              <span className="text-xs font-bold text-center">Quininha</span>
              <span className="text-[10px] text-slate-400 group-hover:text-black/80 font-medium">13 Dezenas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Grupos Mais Frequentes */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Grupos Mais Frequentes</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {analysis.topGruposFrequentes.slice(0, 3).map((g, idx) => (
              <div key={g.grupo} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-400 font-bold">#{idx + 1}</span>
                  <span className="text-base">{g.emoji}</span>
                  <span className="text-slate-200 font-medium">G{formatTwoDigits(g.grupo)} - {g.nome}</span>
                </div>
                <span className="font-mono font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                  {g.aparicoesTotais}x ({g.frequenciaPercentual}%)
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveTab('analise')}
            className="mt-4 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todos os 25 grupos</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Card 2: Grupos Mais Atrasados */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Grupos Mais Atrasados</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {analysis.topGruposAtrasados.slice(0, 3).map((g, idx) => (
              <div key={g.grupo} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-amber-400 font-bold">#{idx + 1}</span>
                  <span className="text-base">{g.emoji}</span>
                  <span className="text-slate-200 font-medium">G{formatTwoDigits(g.grupo)} - {g.nome}</span>
                </div>
                <span className="font-mono font-semibold text-amber-300 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded">
                  {g.atraso} sorteios
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveTab('analise')}
            className="mt-4 text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Análise de ciclos de atraso</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Card 3: Dezenas Quentes (Hot) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dezenas Quentes (Top)</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.topDezenasQuentes.slice(0, 6).map(d => (
              <div
                key={d.dezena}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-xs font-mono font-bold text-rose-300 shadow-sm"
              >
                <span>{d.dezena}</span>
                <span className="text-[10px] text-rose-400 font-normal">({d.aparicoesTotais}x)</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            Maior incidência nos sorteios recentes analisados.
          </div>
        </div>

        {/* Card 4: Dezenas Frias / Atrasadas */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dezenas Frias / Atrasadas</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Snowflake className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.topDezenasAtrasadas.slice(0, 6).map(d => (
              <div
                key={d.dezena}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 shadow-sm"
              >
                <span>{d.dezena}</span>
                <span className="text-[10px] text-cyan-400 font-normal">({d.atraso} sorteios)</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            Com maior intervalo desde a última aparição registrada.
          </div>
        </div>
      </div>

      {/* Grid: Latest Draw Details + Recent Repetitions & Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Available Draw Details */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Último Resultado Histórico Registrado</h3>
            </div>
            {latestDraw && (
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {latestDraw.data}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                  {latestDraw.extracao}
                </span>
              </div>
            )}
          </div>

          {latestDraw ? (
            <div className="mt-5 space-y-3">
              {latestDraw.premios.map((milharStr, pIdx) => {
                const cleanMilhar = milharStr.padStart(4, '0').slice(-4);
                const dezena = cleanMilhar.slice(-2);
                const grupoNum = Math.ceil(parseInt(dezena, 10) === 0 ? 25 : parseInt(dezena, 10) / 4);
                const animal = getAnimalByGrupo(grupoNum);

                return (
                  <div
                    key={pIdx}
                    className={`flex items-center justify-between p-3 rounded-xl border transition ${
                      pIdx === 0
                        ? 'bg-emerald-950/30 border-emerald-500/40 ring-1 ring-emerald-500/20'
                        : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        pIdx === 0 ? 'bg-emerald-500 text-black' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {pIdx + 1}º
                      </span>
                      <div>
                        <span className="font-mono-numbers text-lg font-bold text-white tracking-wider">
                          {cleanMilhar}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          Dezena: <span className="font-mono text-emerald-400 font-bold">{dezena}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{animal.emoji}</span>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-200">
                          G{formatTwoDigits(animal.grupo)} - {animal.nome}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Dezenas: {animal.dezenas.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">Nenhum resultado registrado na base.</div>
          )}

          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Quer consultar todo o histórico ou cadastrar novos sorteios?
            </span>
            <button
              onClick={() => setActiveTab('historico')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Abrir Base Histórica</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Repetitions, Odd/Even Balance, Recency */}
        <div className="space-y-6">
          {/* Dezenas que Mais se Repetem Recentemente */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Repeat className="h-4 w-4 text-purple-400" />
                <h4 className="text-sm font-bold text-white">Repetições Recentes</h4>
              </div>
              <span className="text-[10px] text-slate-400">Últimos 10 sorteios</span>
            </div>

            <div className="mt-3 space-y-2">
              {analysis.dezenasRepetidasRecentes.length > 0 ? (
                analysis.dezenasRepetidasRecentes.slice(0, 5).map(item => (
                  <div key={item.dezena} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 text-xs">
                    <span className="font-mono font-bold text-purple-300">Dezena {item.dezena}</span>
                    <span className="font-semibold text-slate-300 bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded text-[11px]">
                      {item.vezes} aparições
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 py-3 text-center">
                  Distribuição uniforme nos sorteios mais recentes.
                </div>
              )}
            </div>
          </div>

          {/* Equilíbrio Par / Ímpar & Altos / Baixos */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Equilíbrio Estatístico</h4>
              </div>
              <span className="text-[10px] text-slate-400">Total Analisado</span>
            </div>

            {/* Par vs Ímpar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-300">
                <span>Pares ({analysis.distribuicaoParImpar.percentualPares}%)</span>
                <span>Ímpares ({analysis.distribuicaoParImpar.percentualImpares}%)</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${analysis.distribuicaoParImpar.percentualPares}%` }}
                />
                <div
                  className="h-full bg-cyan-500"
                  style={{ width: `${analysis.distribuicaoParImpar.percentualImpares}%` }}
                />
              </div>
            </div>

            {/* Baixos (00-49) vs Altos (50-99) */}
            <div className="mt-4">
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-300">
                <span>Baixos 00-49 ({analysis.distribuicaoAltosBaixos.percentualBaixos}%)</span>
                <span>Altos 50-99 ({analysis.distribuicaoAltosBaixos.percentualAltos}%)</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${analysis.distribuicaoAltosBaixos.percentualBaixos}%` }}
                />
                <div
                  className="h-full bg-purple-500"
                  style={{ width: `${analysis.distribuicaoAltosBaixos.percentualAltos}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
