import React, { useState } from 'react';
import { GeneratedCombination } from '../types';
import {
  Copy,
  Check,
  FileText,
  Printer,
  Trash2,
  RefreshCw,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ResultsPanelProps {
  combinations: GeneratedCombination[];
  title: string;
  onClear: () => void;
  onRegenerate: () => void;
  isGenerating?: boolean;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  combinations,
  title,
  onClear,
  onRegenerate,
  isGenerating = false
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (combinations.length === 0) {
    return (
      <div id="results-panel-empty" className="mt-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Sparkles className="h-7 w-7 animate-pulse" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-200">Nenhuma combinação gerada ainda</h3>
        <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
          Selecione os parâmetros e modo desejados acima e clique em Gerar para iniciar o cálculo estatístico e ver as sugestões.
        </p>
      </div>
    );
  }

  // 12. ONE-CLICK COPY: strictly copy ONLY the generated combinations, one per line!
  const handleCopyAll = async () => {
    const rawText = combinations.map(c => c.textoPuro).join('\n');
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2800);
    } catch {
      // Fallback for iframe restrictions
      const textArea = document.createElement('textarea');
      textArea.value = rawText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2800);
    }
  };

  // 11. STRICT TXT EXPORT: ONLY pure combinations, one per line, no headers, no "Game 1", no scores!
  const handleSaveTxt = () => {
    const rawContent = combinations.map(c => c.textoPuro).join('\n');
    const blob = new Blob([rawContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `combinacoes-${combinations[0]?.modalidade || 'jogos'}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 11. PDF / Printable Export: initiates print layout
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div id="results-panel-container" className="mt-8 rounded-2xl border border-slate-800 bg-[#0f172a]/90 backdrop-blur-md p-5 sm:p-6 shadow-xl">
      {/* Header with Title and Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              {combinations.length} {combinations.length === 1 ? 'Combinação' : 'Combinações'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Resultados estatísticos prontos para validação ou aposta na sua plataforma preferida.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* COPY ALL BUTTON */}
          <button
            id="btn-copy-all"
            onClick={handleCopyAll}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
              copied
                ? 'bg-emerald-500 text-black shadow-emerald-500/25 ring-2 ring-emerald-400'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-95 cursor-pointer'
            }`}
          >
            {copied ? <Check className="h-4 w-4 stroke-[3]" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'COPIADO COM SUCESSO!' : 'COPIAR TUDO'}</span>
          </button>

          {/* SAVE TXT (Pure combinations) */}
          <button
            id="btn-save-txt"
            onClick={handleSaveTxt}
            title="Exportar arquivo TXT limpo apenas com os números (1 por linha)"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer"
          >
            <FileText className="h-4 w-4 text-emerald-400" />
            <span>SALVAR TXT</span>
          </button>

          {/* SAVE PDF / PRINT */}
          <button
            id="btn-save-pdf"
            onClick={handlePrintPdf}
            title="Imprimir ou salvar como PDF para impressão limpa"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer"
          >
            <Printer className="h-4 w-4 text-amber-400" />
            <span>SALVAR PDF</span>
          </button>

          {/* GENERATE AGAIN */}
          <button
            id="btn-regenerate"
            onClick={onRegenerate}
            disabled={isGenerating}
            title="Gerar novo lote de combinações com os mesmos parâmetros"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 text-blue-400 ${isGenerating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">GERAR NOVAMENTE</span>
          </button>

          {/* CLEAR */}
          <button
            id="btn-clear-results"
            onClick={onClear}
            title="Limpar resultados da tela"
            className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Copied alert toast */}
      {copied && (
        <div id="copy-confirmation-toast" className="mt-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-2 text-xs font-medium text-emerald-300 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>Combinações copiadas com sucesso! Apenas os jogos foram copiados para a sua área de transferência.</span>
          </div>
          <span className="text-[11px] text-emerald-400/80">Pronto para colar</span>
        </div>
      )}

      {/* Combinations List */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {combinations.map((comb, index) => {
          const isExpanded = expandedId === comb.id;
          return (
            <div
              key={comb.id}
              id={`combination-card-${index}`}
              className="relative rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 hover:border-emerald-500/40 transition duration-200 group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-mono text-slate-400">#{String(index + 1).padStart(2, '0')}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                    Pares: {comb.pares} / Ímp: {comb.impares}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                    <span>Score:</span>
                    <span className="text-emerald-400">{comb.score}</span>
                  </div>
                </div>
              </div>

              {/* Formatted combination text */}
              <div className="my-1.5 py-2 px-3 rounded-lg bg-[#0a0f1d] border border-slate-800/80 text-center font-mono-numbers font-bold text-white text-base tracking-widest text-emerald-400 group-hover:text-emerald-300 transition">
                {comb.textoPuro}
              </div>

              {/* Labels & Tags */}
              <div className="mt-2.5 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {comb.rotulos.map((rotulo, rIdx) => (
                    <span
                      key={rIdx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
                    >
                      {rotulo}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : comb.id)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-0.5 transition cursor-pointer"
                >
                  <Info className="h-3 w-3" />
                  <span>{isExpanded ? 'Ocultar' : 'Detalhes'}</span>
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>

              {/* Expandable transparent calculation details */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-300 space-y-1.5 bg-slate-950/40 p-2.5 rounded-lg">
                  <div className="text-slate-400 font-medium">Cálculo Transparente do Score Estatístico:</div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Freq. Histórica:</span>
                      <span className="font-mono text-emerald-400">{comb.detalhes.frequenciaScore} pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ciclo de Atraso:</span>
                      <span className="font-mono text-amber-400">{comb.detalhes.atrasoScore} pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tendência Recente:</span>
                      <span className="font-mono text-blue-400">{comb.detalhes.tendenciaScore} pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Distribuição:</span>
                      <span className="font-mono text-purple-400">{comb.detalhes.distribuicaoScore} pts</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-400 italic pt-1">
                    *Pontuação calculada com base na frequência dos dados históricos selecionados. Não garante ganhos futuros.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hidden container dedicated to clean PDF print */}
      <div id="printable-export-area" className="hidden print:block font-mono text-black">
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
          BICHO ANALYZER PRO — LISTA DE JOGOS GERADOS
        </h2>
        <p style={{ fontSize: '11px', color: '#666', marginBottom: '16px' }}>
          Modalidade: {title} | Total de jogos: {combinations.length} | Exportado em {new Date().toLocaleDateString('pt-BR')} {new Date().toLocaleTimeString('pt-BR')}
        </p>
        <hr style={{ marginBottom: '12px' }} />
        <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
          {combinations.map((c, i) => (
            <div key={i}>{c.textoPuro}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
