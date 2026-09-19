export interface AnimalInfo {
  grupo: number;
  nome: string;
  emoji: string;
  dezenas: string[];
}

export interface DrawPrize {
  posicao: number; // 1 to 5 (or 7)
  milhar: string;  // e.g. "4823"
  centena: string; // e.g. "823"
  dezena: string;  // e.g. "23"
  grupo: number;   // e.g. 6 (Cabra)
  bicho: string;   // e.g. "Cabra"
}

export interface DrawResult {
  id: string;
  data: string;          // YYYY-MM-DD
  extracao: string;      // PTM (11h), PT (14h), PTV (16h), FED/PTN (18h-19h), CORUJA (21h)
  loteria: string;       // RJ, Look, Nacional, etc.
  premios: string[];     // Array of 5 to 7 thousands: ["4823", "0912", "7645", ...]
  origem: 'demo' | 'manual' | 'importado' | 'api';
  criadoEm?: string;
}

export interface StatisticalWeights {
  frequencia: number;      // e.g. 30%
  tendenciaRecente: number;// e.g. 25%
  atraso: number;          // e.g. 20%
  distribuicao: number;    // e.g. 15%
  repeticao: number;       // e.g. 10%
}

export interface AdvancedFilters {
  evitarRepetidosSessao: boolean;
  evitarConcentracaoGrupo: boolean;
  minQuentes: number;
  maxQuentes: number;
  minAtrasados: number;
  maxAtrasados: number;
  equilibrarParImpar: boolean;
  equilibrarAltosBaixos: boolean;
}

export type ModalityType = 'terno_grupo' | 'terno_dezena' | 'milhar' | 'quininha';

export interface GeneratedCombination {
  id: string;
  modalidade: ModalityType;
  itens: string[];           // For groups: ["01", "07", "23"]; For decenas: ["07", "34", "81"]; For milhar: ["0472"]; For quininha: 13 items
  textoPuro: string;         // Clean TXT export format strictly: "01 - 07 - 23" or "0472" or "03 - 07 - ..."
  score: number;             // Statistical score (0-100)
  detalhes: {
    frequenciaScore: number;
    atrasoScore: number;
    tendenciaScore: number;
    distribuicaoScore: number;
    repeticaoScore: number;
  };
  rotulos: string[];
  pares: number;
  impares: number;
  criadoEm: number;
}

export interface GroupStatistics {
  grupo: number;
  nome: string;
  emoji: string;
  dezenas: string[];
  aparicoesTotais: number;
  aparicoesPrimeiroPremio: number;
  frequenciaPercentual: number;
  atraso: number; // Sorteios desde a última aparição
  diasAtraso?: number;
  aparicoesRecentes: number; // Nos últimos 10 ou 20 sorteios
  consecutivosMax: number;
  isQuente: boolean;
  isFrio: boolean;
  isAtrasado: boolean;
  scoreEstatistico: number;
}

export interface DezenaStatistics {
  dezena: string; // "00" to "99"
  grupo: number;
  nomeBicho: string;
  aparicoesTotais: number;
  aparicoesPrimeiroPremio: number;
  frequenciaPercentual: number;
  atraso: number; // Sorteios desde a última vez que saiu
  isQuente: boolean;
  isFrio: boolean;
  isAtrasado: boolean;
  scoreEstatistico: number;
}

export interface PositionalDigitStats {
  digito: number; // 0 to 9
  pos1: number;   // 1º dígito da milhar
  pos2: number;   // 2º dígito da milhar
  pos3: number;   // 3º dígito da milhar
  pos4: number;   // 4º dígito da milhar (último)
}

export type PeriodoAnalise = 10 | 20 | 50 | 100 | 500 | 9999;
