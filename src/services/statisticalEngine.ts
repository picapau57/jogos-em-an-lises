import {
  DrawResult,
  GroupStatistics,
  DezenaStatistics,
  PositionalDigitStats,
  StatisticalWeights,
  PeriodoAnalise
} from '../types';
import { ANIMAIS_BICHO, getGrupoFromDezena, formatTwoDigits } from '../data/bichoData';

export interface ComprehensiveAnalysis {
  totalSorteiosAnalisados: number;
  periodoSelecionado: PeriodoAnalise;
  gruposStats: GroupStatistics[];
  dezenasStats: DezenaStatistics[];
  digitosPosicionais: PositionalDigitStats[];
  quininhaStats: { numero: string; aparicoes: number; atraso: number; score: number; isQuente: boolean; isAtrasado: boolean }[];
  
  // Quick Dashboard Insights
  topGruposFrequentes: GroupStatistics[];
  topGruposAtrasados: GroupStatistics[];
  topDezenasQuentes: DezenaStatistics[];
  topDezenasFrias: DezenaStatistics[];
  topDezenasAtrasadas: DezenaStatistics[];
  dezenasRepetidasRecentes: { dezena: string; vezes: number }[];
  
  distribuicaoParImpar: { pares: number; impares: number; percentualPares: number; percentualImpares: number };
  distribuicaoAltosBaixos: { baixos: number; altos: number; percentualBaixos: number; percentualAltos: number }; // 00-49 vs 50-99
}

export function computeComprehensiveAnalysis(
  results: DrawResult[],
  periodo: PeriodoAnalise = 50,
  weights: StatisticalWeights = {
    frequencia: 30,
    tendenciaRecente: 25,
    atraso: 20,
    distribuicao: 15,
    repeticao: 10
  }
): ComprehensiveAnalysis {
  // Sort results by date/recency descending (first item is the newest draw)
  const sorted = [...results].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  const dataset = periodo === 9999 ? sorted : sorted.slice(0, periodo);
  const total = dataset.length || 1;

  // Initialize Group stats (1 to 25)
  const groupStatsMap: Record<number, {
    aparicoesTotais: number;
    aparicoesPrimeiroPremio: number;
    ultimoIndex: number;
    aparicoesRecentes: number;
    consecutivosMax: number;
    consecutivosAtual: number;
  }> = {};

  for (let g = 1; g <= 25; g++) {
    groupStatsMap[g] = {
      aparicoesTotais: 0,
      aparicoesPrimeiroPremio: 0,
      ultimoIndex: -1,
      aparicoesRecentes: 0,
      consecutivosMax: 0,
      consecutivosAtual: 0
    };
  }

  // Initialize Dezena stats (00 to 99)
  const dezenaStatsMap: Record<string, {
    aparicoesTotais: number;
    aparicoesPrimeiroPremio: number;
    ultimoIndex: number;
    aparicoesRecentes: number;
  }> = {};

  for (let i = 0; i <= 99; i++) {
    const dStr = formatTwoDigits(i);
    dezenaStatsMap[dStr] = {
      aparicoesTotais: 0,
      aparicoesPrimeiroPremio: 0,
      ultimoIndex: -1,
      aparicoesRecentes: 0
    };
  }

  // Positional digits (0 to 9)
  const positionalDigits: PositionalDigitStats[] = Array.from({ length: 10 }, (_, d) => ({
    digito: d,
    pos1: 0,
    pos2: 0,
    pos3: 0,
    pos4: 0
  }));

  let totalDezenasPares = 0;
  let totalDezenasImpares = 0;
  let totalDezenasBaixas = 0; // 00 to 49
  let totalDezenasAltas = 0;  // 50 to 99

  // Scan draws from newest (index 0) to oldest
  dataset.forEach((draw, drawIdx) => {
    const groupsInThisDraw = new Set<number>();

    draw.premios.forEach((milharStr, pIndex) => {
      const cleanMilhar = milharStr.replace(/\D/g, '').padStart(4, '0').slice(-4);
      const dezenaStr = cleanMilhar.slice(-2);
      const grupo = getGrupoFromDezena(dezenaStr);

      // Positional digits for milhar (1st prize gets special weight, but all are tallied)
      if (pIndex === 0) {
        const d1 = parseInt(cleanMilhar[0], 10) || 0;
        const d2 = parseInt(cleanMilhar[1], 10) || 0;
        const d3 = parseInt(cleanMilhar[2], 10) || 0;
        const d4 = parseInt(cleanMilhar[3], 10) || 0;
        positionalDigits[d1].pos1++;
        positionalDigits[d2].pos2++;
        positionalDigits[d3].pos3++;
        positionalDigits[d4].pos4++;
      }

      // Par / Ímpar
      const dezVal = parseInt(dezenaStr, 10);
      if (dezVal % 2 === 0) totalDezenasPares++;
      else totalDezenasImpares++;

      // Altos / Baixos
      if (dezVal < 50) totalDezenasBaixas++;
      else totalDezenasAltas++;

      // Dezena map
      if (dezenaStatsMap[dezenaStr]) {
        dezenaStatsMap[dezenaStr].aparicoesTotais++;
        if (pIndex === 0) dezenaStatsMap[dezenaStr].aparicoesPrimeiroPremio++;
        if (dezenaStatsMap[dezenaStr].ultimoIndex === -1) {
          dezenaStatsMap[dezenaStr].ultimoIndex = drawIdx;
        }
        if (drawIdx < Math.min(10, total)) {
          dezenaStatsMap[dezenaStr].aparicoesRecentes++;
        }
      }

      // Group map
      if (groupStatsMap[grupo]) {
        groupStatsMap[grupo].aparicoesTotais++;
        if (pIndex === 0) groupStatsMap[grupo].aparicoesPrimeiroPremio++;
        if (groupStatsMap[grupo].ultimoIndex === -1) {
          groupStatsMap[grupo].ultimoIndex = drawIdx;
        }
        if (drawIdx < Math.min(10, total)) {
          groupStatsMap[grupo].aparicoesRecentes++;
        }
        groupsInThisDraw.add(grupo);
      }
    });

    // Consecutive checks for groups
    for (let g = 1; g <= 25; g++) {
      if (groupsInThisDraw.has(g)) {
        groupStatsMap[g].consecutivosAtual++;
        if (groupStatsMap[g].consecutivosAtual > groupStatsMap[g].consecutivosMax) {
          groupStatsMap[g].consecutivosMax = groupStatsMap[g].consecutivosAtual;
        }
      } else {
        groupStatsMap[g].consecutivosAtual = 0;
      }
    }
  });

  // Calculate Group Statistics Array
  const maxGroupFreq = Math.max(...Object.values(groupStatsMap).map(g => g.aparicoesTotais), 1);
  const maxGroupAtraso = Math.max(...Object.values(groupStatsMap).map(g => (g.ultimoIndex === -1 ? total : g.ultimoIndex)), 1);

  const gruposStats: GroupStatistics[] = ANIMAIS_BICHO.map(animal => {
    const raw = groupStatsMap[animal.grupo];
    const atraso = raw.ultimoIndex === -1 ? total : raw.ultimoIndex;
    const freqPerc = Number(((raw.aparicoesTotais / (total * 5)) * 100).toFixed(1));

    // Transparent calculation for score (0 to 100)
    const freqScore = (raw.aparicoesTotais / maxGroupFreq) * 100;
    const atrasoScore = (atraso / maxGroupAtraso) * 100;
    const tendenciaScore = (raw.aparicoesRecentes / Math.max(1, Math.min(10, total))) * 100;
    const distribuicaoScore = 50 + (animal.grupo % 2 === 0 ? 10 : -10); // balanced distribution spread
    const repeticaoScore = Math.min(100, raw.consecutivosMax * 35);

    const scoreEstatistico = Math.min(99.9, Math.max(10, Number((
      (freqScore * weights.frequencia +
       atrasoScore * weights.atraso +
       tendenciaScore * weights.tendenciaRecente +
       distribuicaoScore * weights.distribuicao +
       repeticaoScore * weights.repeticao) / 100
    ).toFixed(1))));

    return {
      grupo: animal.grupo,
      nome: animal.nome,
      emoji: animal.emoji,
      dezenas: animal.dezenas,
      aparicoesTotais: raw.aparicoesTotais,
      aparicoesPrimeiroPremio: raw.aparicoesPrimeiroPremio,
      frequenciaPercentual: freqPerc,
      atraso,
      aparicoesRecentes: raw.aparicoesRecentes,
      consecutivosMax: raw.consecutivosMax,
      isQuente: false,
      isFrio: false,
      isAtrasado: false,
      scoreEstatistico
    };
  });

  // Tag hot, cold, delayed groups based on percentiles
  const sortedByFreq = [...gruposStats].sort((a, b) => b.aparicoesTotais - a.aparicoesTotais);
  const sortedByDelay = [...gruposStats].sort((a, b) => b.atraso - a.atraso);

  sortedByFreq.slice(0, 6).forEach(g => { g.isQuente = true; });
  sortedByFreq.slice(-6).forEach(g => { g.isFrio = true; });
  sortedByDelay.slice(0, 6).forEach(g => { g.isAtrasado = true; });

  // Dezena Statistics Array
  const maxDezenaFreq = Math.max(...Object.values(dezenaStatsMap).map(d => d.aparicoesTotais), 1);
  const maxDezenaAtraso = Math.max(...Object.values(dezenaStatsMap).map(d => (d.ultimoIndex === -1 ? total : d.ultimoIndex)), 1);

  const dezenasStats: DezenaStatistics[] = Object.keys(dezenaStatsMap).map(dezStr => {
    const raw = dezenaStatsMap[dezStr];
    const grupo = getGrupoFromDezena(dezStr);
    const animal = ANIMAIS_BICHO.find(a => a.grupo === grupo);
    const atraso = raw.ultimoIndex === -1 ? total : raw.ultimoIndex;
    const freqPerc = Number(((raw.aparicoesTotais / (total * 5)) * 100).toFixed(1));

    const freqScore = (raw.aparicoesTotais / maxDezenaFreq) * 100;
    const atrasoScore = (atraso / maxDezenaAtraso) * 100;
    const tendenciaScore = (raw.aparicoesRecentes / Math.max(1, Math.min(10, total))) * 100;
    const distribuicaoScore = 50;
    const repeticaoScore = raw.aparicoesRecentes > 1 ? 80 : 30;

    const scoreEstatistico = Math.min(99.9, Math.max(10, Number((
      (freqScore * weights.frequencia +
       atrasoScore * weights.atraso +
       tendenciaScore * weights.tendenciaRecente +
       distribuicaoScore * weights.distribuicao +
       repeticaoScore * weights.repeticao) / 100
    ).toFixed(1))));

    return {
      dezena: dezStr,
      grupo,
      nomeBicho: animal ? animal.nome : '',
      aparicoesTotais: raw.aparicoesTotais,
      aparicoesPrimeiroPremio: raw.aparicoesPrimeiroPremio,
      frequenciaPercentual: freqPerc,
      atraso,
      isQuente: false,
      isFrio: false,
      isAtrasado: false,
      scoreEstatistico
    };
  });

  const sortedDezByFreq = [...dezenasStats].sort((a, b) => b.aparicoesTotais - a.aparicoesTotais);
  const sortedDezByDelay = [...dezenasStats].sort((a, b) => b.atraso - a.atraso);

  sortedDezByFreq.slice(0, 15).forEach(d => { d.isQuente = true; });
  sortedDezByFreq.slice(-15).forEach(d => { d.isFrio = true; });
  sortedDezByDelay.slice(0, 15).forEach(d => { d.isAtrasado = true; });

  // Quininha stats (01 to 80)
  const quininhaStats = Array.from({ length: 80 }, (_, idx) => {
    const numStr = formatTwoDigits(idx + 1);
    const dStat = dezenasStats.find(d => d.dezena === numStr);
    return {
      numero: numStr,
      aparicoes: dStat ? dStat.aparicoesTotais : 0,
      atraso: dStat ? dStat.atraso : total,
      score: dStat ? dStat.scoreEstatistico : 50,
      isQuente: dStat ? dStat.isQuente : false,
      isAtrasado: dStat ? dStat.isAtrasado : false
    };
  });

  // Recent repeats (dezenas with multiple hits in last 10 draws)
  const dezenasRepetidasRecentes = Object.keys(dezenaStatsMap)
    .filter(d => dezenaStatsMap[d].aparicoesRecentes >= 2)
    .map(d => ({ dezena: d, vezes: dezenaStatsMap[d].aparicoesRecentes }))
    .sort((a, b) => b.vezes - a.vezes);

  const totalDezenasAmpliadas = totalDezenasPares + totalDezenasImpares || 1;
  const totalAltosBaixos = totalDezenasBaixas + totalDezenasAltas || 1;

  return {
    totalSorteiosAnalisados: dataset.length,
    periodoSelecionado: periodo,
    gruposStats,
    dezenasStats,
    digitosPosicionais: positionalDigits,
    quininhaStats,
    topGruposFrequentes: [...gruposStats].sort((a, b) => b.aparicoesTotais - a.aparicoesTotais).slice(0, 6),
    topGruposAtrasados: [...gruposStats].sort((a, b) => b.atraso - a.atraso).slice(0, 6),
    topDezenasQuentes: [...dezenasStats].sort((a, b) => b.aparicoesTotais - a.aparicoesTotais).slice(0, 10),
    topDezenasFrias: [...dezenasStats].sort((a, b) => a.aparicoesTotais - b.aparicoesTotais).slice(0, 10),
    topDezenasAtrasadas: [...dezenasStats].sort((a, b) => b.atraso - a.atraso).slice(0, 10),
    dezenasRepetidasRecentes,
    distribuicaoParImpar: {
      pares: totalDezenasPares,
      impares: totalDezenasImpares,
      percentualPares: Number(((totalDezenasPares / totalDezenasAmpliadas) * 100).toFixed(1)),
      percentualImpares: Number(((totalDezenasImpares / totalDezenasAmpliadas) * 100).toFixed(1))
    },
    distribuicaoAltosBaixos: {
      baixos: totalDezenasBaixas,
      altos: totalDezenasAltas,
      percentualBaixos: Number(((totalDezenasBaixas / totalAltosBaixos) * 100).toFixed(1)),
      percentualAltos: Number(((totalDezenasAltas / totalAltosBaixos) * 100).toFixed(1))
    }
  };
}
