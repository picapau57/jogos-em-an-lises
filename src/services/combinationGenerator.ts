import {
  GeneratedCombination,
  ModalityType,
  AdvancedFilters,
  StatisticalWeights
} from '../types';
import { formatTwoDigits, formatFourDigits, getGrupoFromDezena } from '../data/bichoData';
import { ComprehensiveAnalysis } from './statisticalEngine';

export type TernoGrupoMode = 'score' | 'quentes' | 'atrasados' | 'misto' | 'balanceado';
export type TernoDezenaMode = 'hot' | 'cold' | 'mixed' | 'balanced';
export type MilharMode = 'posicional' | 'quente' | 'atrasada' | 'balanceada';
export type QuininhaMode = 'frequency' | 'delay' | 'mixed' | 'balanced';

// Helper: pick weighted item
function weightedPick<T extends { score: number }>(items: T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + Math.max(1, item.score), 0);
  let random = Math.random() * totalWeight;
  for (const item of items) {
    random -= Math.max(1, item.score);
    if (random <= 0) return item;
  }
  return items[0];
}

// Session cache to prevent duplicates within a user's session
const sessionCache = new Set<string>();

export function clearSessionCache(): void {
  sessionCache.clear();
}

/**
 * GENERATOR: TERNOS DE GRUPOS (01 - 25)
 */
export function generateTernosDeGrupos(
  analysis: ComprehensiveAnalysis,
  quantity: number,
  mode: TernoGrupoMode,
  filters: AdvancedFilters,
  weights: StatisticalWeights
): GeneratedCombination[] {
  const results: GeneratedCombination[] = [];
  const currentBatchKeys = new Set<string>();
  let attempts = 0;
  const maxAttempts = quantity * 150;

  // Candidate pool with scores
  const candidates = analysis.gruposStats.map(g => {
    let effectiveScore = g.scoreEstatistico;
    if (mode === 'quentes') {
      effectiveScore = g.isQuente ? 95 : g.aparicoesTotais * 10;
    } else if (mode === 'atrasados') {
      effectiveScore = g.isAtrasado ? 95 : g.atraso * 10;
    } else if (mode === 'misto') {
      effectiveScore = (g.isQuente || g.isAtrasado) ? 90 : 40;
    }
    return {
      grupo: g.grupo,
      str: formatTwoDigits(g.grupo),
      score: effectiveScore,
      isQuente: g.isQuente,
      isAtrasado: g.isAtrasado,
      stat: g
    };
  });

  while (results.length < quantity && attempts < maxAttempts) {
    attempts++;
    let chosen: typeof candidates[0][] = [];

    if (mode === 'balanceado') {
      // Split into 3 tiers: 01-08, 09-17, 18-25
      const tier1 = candidates.filter(c => c.grupo <= 8);
      const tier2 = candidates.filter(c => c.grupo > 8 && c.grupo <= 17);
      const tier3 = candidates.filter(c => c.grupo > 17);
      chosen = [
        weightedPick(tier1),
        weightedPick(tier2),
        weightedPick(tier3)
      ];
    } else if (mode === 'misto') {
      const quentes = candidates.filter(c => c.isQuente);
      const atrasados = candidates.filter(c => c.isAtrasado);
      const rest = candidates.filter(c => !c.isQuente && !c.isAtrasado);

      const p1 = weightedPick(quentes.length ? quentes : candidates);
      let p2 = weightedPick(atrasados.length ? atrasados : candidates);
      while (p2.grupo === p1.grupo) {
        p2 = weightedPick(candidates);
      }
      let p3 = weightedPick(rest.length ? rest : candidates);
      while (p3.grupo === p1.grupo || p3.grupo === p2.grupo) {
        p3 = weightedPick(candidates);
      }
      chosen = [p1, p2, p3];
    } else {
      // Pick 3 distinct candidates
      const pool = [...candidates];
      for (let i = 0; i < 3; i++) {
        const pick = weightedPick(pool);
        chosen.push(pick);
        const idx = pool.findIndex(p => p.grupo === pick.grupo);
        if (idx !== -1) pool.splice(idx, 1);
      }
    }

    // Sort ascending
    chosen.sort((a, b) => a.grupo - b.grupo);
    const sortedGroups = chosen.map(c => c.str);
    const key = sortedGroups.join('-');

    // Duplicate check
    if (currentBatchKeys.has(key)) continue;
    if (filters.evitarRepetidosSessao && sessionCache.has(key)) continue;

    // Filter verification
    const hotCount = chosen.filter(c => c.isQuente).length;
    const delayedCount = chosen.filter(c => c.isAtrasado).length;

    if (filters.minQuentes > 0 && hotCount < filters.minQuentes) continue;
    if (filters.maxQuentes < 3 && hotCount > filters.maxQuentes) continue;
    if (filters.minAtrasados > 0 && delayedCount < filters.minAtrasados) continue;
    if (filters.maxAtrasados < 3 && delayedCount > filters.maxAtrasados) continue;

    currentBatchKeys.add(key);
    sessionCache.add(key);

    const avgScore = Number((chosen.reduce((acc, c) => acc + c.score, 0) / 3).toFixed(1));
    const labels: string[] = [];
    if (hotCount >= 2) labels.push('Frequência Alta');
    if (delayedCount >= 2) labels.push('Tendência de Retorno');
    if (mode === 'balanceado') labels.push('Equilibrado');

    const cleanTxt = sortedGroups.join(' - ');

    results.push({
      id: `tg-${Date.now()}-${results.length}`,
      modalidade: 'terno_grupo',
      itens: sortedGroups,
      textoPuro: cleanTxt,
      score: avgScore,
      detalhes: {
        frequenciaScore: Number((weights.frequencia * (avgScore / 100)).toFixed(1)),
        atrasoScore: Number((weights.atraso * (avgScore / 100)).toFixed(1)),
        tendenciaScore: Number((weights.tendenciaRecente * (avgScore / 100)).toFixed(1)),
        distribuicaoScore: Number((weights.distribuicao * (avgScore / 100)).toFixed(1)),
        repeticaoScore: Number((weights.repeticao * (avgScore / 100)).toFixed(1)),
      },
      rotulos: labels.length ? labels : ['Estatístico'],
      pares: chosen.filter(c => c.grupo % 2 === 0).length,
      impares: chosen.filter(c => c.grupo % 2 !== 0).length,
      criadoEm: Date.now()
    });
  }

  return results;
}

/**
 * GENERATOR: TERNOS DE DEZENAS (00 - 99)
 */
export function generateTernosDeDezenas(
  analysis: ComprehensiveAnalysis,
  quantity: number,
  mode: TernoDezenaMode,
  filters: AdvancedFilters,
  weights: StatisticalWeights
): GeneratedCombination[] {
  const results: GeneratedCombination[] = [];
  const currentBatchKeys = new Set<string>();
  let attempts = 0;
  const maxAttempts = quantity * 150;

  const candidates = analysis.dezenasStats.map(d => {
    let effScore = d.scoreEstatistico;
    if (mode === 'hot') {
      effScore = d.isQuente ? 95 : d.aparicoesTotais * 8;
    } else if (mode === 'cold') {
      effScore = (d.isFrio || d.isAtrasado) ? 95 : d.atraso * 8;
    } else if (mode === 'mixed') {
      effScore = (d.isQuente || d.isAtrasado) ? 90 : 40;
    }
    return {
      dezena: d.dezena,
      num: parseInt(d.dezena, 10),
      grupo: d.grupo,
      score: effScore,
      isQuente: d.isQuente,
      isAtrasado: d.isAtrasado,
      stat: d
    };
  });

  while (results.length < quantity && attempts < maxAttempts) {
    attempts++;
    let chosen: typeof candidates[0][] = [];

    if (mode === 'balanced') {
      // 00-33, 34-66, 67-99
      const tier1 = candidates.filter(c => c.num <= 33);
      const tier2 = candidates.filter(c => c.num >= 34 && c.num <= 66);
      const tier3 = candidates.filter(c => c.num >= 67);
      chosen = [
        weightedPick(tier1),
        weightedPick(tier2),
        weightedPick(tier3)
      ];
    } else if (mode === 'mixed') {
      const quentes = candidates.filter(c => c.isQuente);
      const frias = candidates.filter(c => c.isAtrasado);
      const p1 = weightedPick(quentes.length ? quentes : candidates);
      let p2 = weightedPick(frias.length ? frias : candidates);
      while (p2.dezena === p1.dezena) p2 = weightedPick(candidates);
      let p3 = weightedPick(candidates);
      while (p3.dezena === p1.dezena || p3.dezena === p2.dezena) p3 = weightedPick(candidates);
      chosen = [p1, p2, p3];
    } else {
      const pool = [...candidates];
      for (let i = 0; i < 3; i++) {
        const pick = weightedPick(pool);
        chosen.push(pick);
        const idx = pool.findIndex(p => p.dezena === pick.dezena);
        if (idx !== -1) pool.splice(idx, 1);
      }
    }

    // Unique check within the terno
    if (new Set(chosen.map(c => c.dezena)).size < 3) continue;

    // Filter: avoid concentration in same group (animal)
    if (filters.evitarConcentracaoGrupo) {
      const groups = new Set(chosen.map(c => c.grupo));
      if (groups.size < 2) continue; // At least 2 different groups
    }

    // Sort ascending numerically
    chosen.sort((a, b) => a.num - b.num);
    const sortedDezenas = chosen.map(c => c.dezena);
    const key = sortedDezenas.join('-');

    if (currentBatchKeys.has(key)) continue;
    if (filters.evitarRepetidosSessao && sessionCache.has(key)) continue;

    // Filter Par / Ímpar
    const pares = chosen.filter(c => c.num % 2 === 0).length;
    const impares = 3 - pares;
    if (filters.equilibrarParImpar && (pares === 3 || impares === 3)) continue;

    // Filter Altos / Baixos
    const baixos = chosen.filter(c => c.num < 50).length;
    const altos = 3 - baixos;
    if (filters.equilibrarAltosBaixos && (baixos === 3 || altos === 3)) continue;

    currentBatchKeys.add(key);
    sessionCache.add(key);

    const avgScore = Number((chosen.reduce((acc, c) => acc + c.score, 0) / 3).toFixed(1));
    const labels: string[] = [];
    if (chosen.some(c => c.isQuente)) labels.push('Alta Frequência');
    if (chosen.some(c => c.isAtrasado)) labels.push('Ciclo de Atraso');
    if (mode === 'balanced') labels.push('Faixas Equilibradas');

    const cleanTxt = sortedDezenas.join(' - ');

    results.push({
      id: `td-${Date.now()}-${results.length}`,
      modalidade: 'terno_dezena',
      itens: sortedDezenas,
      textoPuro: cleanTxt,
      score: avgScore,
      detalhes: {
        frequenciaScore: Number((weights.frequencia * (avgScore / 100)).toFixed(1)),
        atrasoScore: Number((weights.atraso * (avgScore / 100)).toFixed(1)),
        tendenciaScore: Number((weights.tendenciaRecente * (avgScore / 100)).toFixed(1)),
        distribuicaoScore: Number((weights.distribuicao * (avgScore / 100)).toFixed(1)),
        repeticaoScore: Number((weights.repeticao * (avgScore / 100)).toFixed(1)),
      },
      rotulos: labels.length ? labels : ['Estatístico'],
      pares,
      impares,
      criadoEm: Date.now()
    });
  }

  return results;
}

/**
 * GENERATOR: MILHARES (4 dígitos: 0000 - 9999)
 */
export function generateMilhares(
  analysis: ComprehensiveAnalysis,
  quantity: number,
  mode: MilharMode,
  filters: AdvancedFilters,
  weights: StatisticalWeights
): GeneratedCombination[] {
  const results: GeneratedCombination[] = [];
  const currentBatchKeys = new Set<string>();
  let attempts = 0;
  const maxAttempts = quantity * 150;

  // Compute digit frequencies for positions 1, 2, 3, 4
  const posWeights = [1, 2, 3, 4].map(pos => {
    return Array.from({ length: 10 }, (_, d) => {
      const pStat = analysis.digitosPosicionais[d];
      let val = 1;
      if (pos === 1) val = pStat.pos1;
      if (pos === 2) val = pStat.pos2;
      if (pos === 3) val = pStat.pos3;
      if (pos === 4) val = pStat.pos4;
      return { digit: d, score: val + 2 };
    });
  });

  // Top final tens for high affinity
  const hotDezenas = analysis.topDezenasQuentes.map(d => d.dezena);

  while (results.length < quantity && attempts < maxAttempts) {
    attempts++;
    let milharStr = '';

    if (mode === 'posicional' || mode === 'quente') {
      // Pick based on positional digit stats
      const d1 = weightedPick(posWeights[0]).digit;
      const d2 = weightedPick(posWeights[1]).digit;
      let d3: number;
      let d4: number;

      if (mode === 'quente' && hotDezenas.length > 0 && Math.random() < 0.6) {
        // Embed a hot dezena in the final 2 digits
        const pickDez = hotDezenas[Math.floor(Math.random() * hotDezenas.length)];
        d3 = parseInt(pickDez[0], 10);
        d4 = parseInt(pickDez[1], 10);
      } else {
        d3 = weightedPick(posWeights[2]).digit;
        d4 = weightedPick(posWeights[3]).digit;
      }
      milharStr = `${d1}${d2}${d3}${d4}`;
    } else if (mode === 'atrasada') {
      // Pick digits with low historical appearance (delayed cycles)
      const invWeights = posWeights.map(p =>
        p.map(item => ({ digit: item.digit, score: Math.max(1, 15 - item.score) }))
      );
      const d1 = weightedPick(invWeights[0]).digit;
      const d2 = weightedPick(invWeights[1]).digit;
      const d3 = weightedPick(invWeights[2]).digit;
      const d4 = weightedPick(invWeights[3]).digit;
      milharStr = `${d1}${d2}${d3}${d4}`;
    } else {
      // Balanced
      const d1 = Math.floor(Math.random() * 10);
      const d2 = Math.floor(Math.random() * 10);
      const d3 = Math.floor(Math.random() * 10);
      const d4 = Math.floor(Math.random() * 10);
      milharStr = `${d1}${d2}${d3}${d4}`;
    }

    // Preserve exactly 4 digits
    milharStr = formatFourDigits(milharStr);

    if (currentBatchKeys.has(milharStr)) continue;
    if (filters.evitarRepetidosSessao && sessionCache.has(milharStr)) continue;

    currentBatchKeys.add(milharStr);
    sessionCache.add(milharStr);

    const dezenaFinal = milharStr.slice(-2);
    const grupo = getGrupoFromDezena(dezenaFinal);
    const gStat = analysis.gruposStats.find(g => g.grupo === grupo);
    const milharScore = gStat ? gStat.scoreEstatistico : 75;

    const labels: string[] = [];
    labels.push(`Grupo ${formatTwoDigits(grupo)} (${gStat?.nome || 'Bicho'})`);
    if (gStat?.isQuente) labels.push('Final Quente');
    if (gStat?.isAtrasado) labels.push('Final em Atraso');

    results.push({
      id: `milhar-${Date.now()}-${results.length}`,
      modalidade: 'milhar',
      itens: [milharStr],
      textoPuro: milharStr, // STRICT: EXACTLY "0472"
      score: milharScore,
      detalhes: {
        frequenciaScore: Number((weights.frequencia * (milharScore / 100)).toFixed(1)),
        atrasoScore: Number((weights.atraso * (milharScore / 100)).toFixed(1)),
        tendenciaScore: Number((weights.tendenciaRecente * (milharScore / 100)).toFixed(1)),
        distribuicaoScore: Number((weights.distribuicao * (milharScore / 100)).toFixed(1)),
        repeticaoScore: Number((weights.repeticao * (milharScore / 100)).toFixed(1)),
      },
      rotulos: labels,
      pares: [0, 1, 2, 3].filter(i => parseInt(milharStr[i], 10) % 2 === 0).length,
      impares: [0, 1, 2, 3].filter(i => parseInt(milharStr[i], 10) % 2 !== 0).length,
      criadoEm: Date.now()
    });
  }

  return results;
}

/**
 * GENERATOR: QUININHA — 13 DEZENAS (01 - 80)
 */
export function generateQuininha(
  analysis: ComprehensiveAnalysis,
  quantity: number,
  mode: QuininhaMode,
  filters: AdvancedFilters,
  weights: StatisticalWeights
): GeneratedCombination[] {
  const results: GeneratedCombination[] = [];
  const currentBatchKeys = new Set<string>();
  let attempts = 0;
  const maxAttempts = quantity * 150;

  const candidates = analysis.quininhaStats.map(q => {
    let effScore = q.score;
    if (mode === 'frequency') {
      effScore = q.isQuente ? 95 : q.aparicoes * 10;
    } else if (mode === 'delay') {
      effScore = q.isAtrasado ? 95 : q.atraso * 10;
    } else if (mode === 'mixed') {
      effScore = (q.isQuente || q.isAtrasado) ? 92 : 45;
    }
    return {
      numero: q.numero,
      num: parseInt(q.numero, 10),
      score: effScore,
      isQuente: q.isQuente,
      isAtrasado: q.isAtrasado
    };
  });

  while (results.length < quantity && attempts < maxAttempts) {
    attempts++;
    const chosenSet = new Set<string>();
    const chosenItems: typeof candidates[0][] = [];

    if (mode === 'balanced') {
      // 4 quadrants across 01-80: 01-20, 21-40, 41-60, 61-80 (3 to 4 numbers per quadrant)
      const q1 = candidates.filter(c => c.num <= 20);
      const q2 = candidates.filter(c => c.num > 20 && c.num <= 40);
      const q3 = candidates.filter(c => c.num > 40 && c.num <= 60);
      const q4 = candidates.filter(c => c.num > 60);

      const quotas = [3, 3, 3, 4]; // Total 13
      const quads = [q1, q2, q3, q4];

      quads.forEach((quad, idx) => {
        const pool = [...quad];
        const quota = quotas[idx];
        for (let k = 0; k < quota && pool.length > 0; k++) {
          const pick = weightedPick(pool);
          if (!chosenSet.has(pick.numero)) {
            chosenSet.add(pick.numero);
            chosenItems.push(pick);
            const pIdx = pool.findIndex(p => p.numero === pick.numero);
            if (pIdx !== -1) pool.splice(pIdx, 1);
          }
        }
      });

      // Fill remainder if any quadrant had duplicates
      const fullPool = [...candidates];
      while (chosenItems.length < 13) {
        const pick = weightedPick(fullPool);
        if (!chosenSet.has(pick.numero)) {
          chosenSet.add(pick.numero);
          chosenItems.push(pick);
        }
      }
    } else {
      const pool = [...candidates];
      while (chosenItems.length < 13 && pool.length > 0) {
        const pick = weightedPick(pool);
        if (!chosenSet.has(pick.numero)) {
          chosenSet.add(pick.numero);
          chosenItems.push(pick);
          const pIdx = pool.findIndex(p => p.numero === pick.numero);
          if (pIdx !== -1) pool.splice(pIdx, 1);
        }
      }
    }

    if (chosenItems.length !== 13) continue;

    // Ascending numerical order
    chosenItems.sort((a, b) => a.num - b.num);
    const sortedNums = chosenItems.map(c => c.numero);
    const key = sortedNums.join('-');

    if (currentBatchKeys.has(key)) continue;
    if (filters.evitarRepetidosSessao && sessionCache.has(key)) continue;

    currentBatchKeys.add(key);
    sessionCache.add(key);

    const avgScore = Number((chosenItems.reduce((sum, c) => sum + c.score, 0) / 13).toFixed(1));
    const cleanTxt = sortedNums.join(' - ');

    const pares = chosenItems.filter(c => c.num % 2 === 0).length;
    const impares = 13 - pares;

    const labels: string[] = ['13 Dezenas'];
    if (mode === 'balanced') labels.push('Quadrantes Balanceados');
    if (mode === 'frequency') labels.push('Frequência Histórica');
    if (mode === 'delay') labels.push('Atraso Estatístico');

    results.push({
      id: `quin-${Date.now()}-${results.length}`,
      modalidade: 'quininha',
      itens: sortedNums,
      textoPuro: cleanTxt, // STRICT: "03 - 07 - 12 - 18 - 25 - 31 - 37 - 44 - 51 - 59 - 63 - 72 - 80"
      score: avgScore,
      detalhes: {
        frequenciaScore: Number((weights.frequencia * (avgScore / 100)).toFixed(1)),
        atrasoScore: Number((weights.atraso * (avgScore / 100)).toFixed(1)),
        tendenciaScore: Number((weights.tendenciaRecente * (avgScore / 100)).toFixed(1)),
        distribuicaoScore: Number((weights.distribuicao * (avgScore / 100)).toFixed(1)),
        repeticaoScore: Number((weights.repeticao * (avgScore / 100)).toFixed(1)),
      },
      rotulos: labels,
      pares,
      impares,
      criadoEm: Date.now()
    });
  }

  return results;
}
