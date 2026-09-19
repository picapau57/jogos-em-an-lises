import { AnimalInfo, DrawResult } from '../types';

export const ANIMAIS_BICHO: AnimalInfo[] = [
  { grupo: 1, nome: 'Avestruz', emoji: '🦤', dezenas: ['01', '02', '03', '04'] },
  { grupo: 2, nome: 'Águia', emoji: '🦅', dezenas: ['05', '06', '07', '08'] },
  { grupo: 3, nome: 'Burro', emoji: '🫏', dezenas: ['09', '10', '11', '12'] },
  { grupo: 4, nome: 'Borboleta', emoji: '🦋', dezenas: ['13', '14', '15', '16'] },
  { grupo: 5, nome: 'Cachorro', emoji: '🐕', dezenas: ['17', '18', '19', '20'] },
  { grupo: 6, nome: 'Cabra', emoji: '🐐', dezenas: ['21', '22', '23', '24'] },
  { grupo: 7, nome: 'Carneiro', emoji: '🐏', dezenas: ['25', '26', '27', '28'] },
  { grupo: 8, nome: 'Camelo', emoji: '🐫', dezenas: ['29', '30', '31', '32'] },
  { grupo: 9, nome: 'Cobra', emoji: '🐍', dezenas: ['33', '34', '35', '36'] },
  { grupo: 10, nome: 'Coelho', emoji: '🐇', dezenas: ['37', '38', '39', '40'] },
  { grupo: 11, nome: 'Cavalo', emoji: '🐎', dezenas: ['41', '42', '43', '44'] },
  { grupo: 12, nome: 'Elefante', emoji: '🐘', dezenas: ['45', '46', '47', '48'] },
  { grupo: 13, nome: 'Galo', emoji: '🐓', dezenas: ['49', '50', '51', '52'] },
  { grupo: 14, nome: 'Gato', emoji: '🐈', dezenas: ['53', '54', '55', '56'] },
  { grupo: 15, nome: 'Jacaré', emoji: '🐊', dezenas: ['57', '58', '59', '60'] },
  { grupo: 16, nome: 'Leão', emoji: '🦁', dezenas: ['61', '62', '63', '64'] },
  { grupo: 17, nome: 'Macaco', emoji: '🐒', dezenas: ['65', '66', '67', '68'] },
  { grupo: 18, nome: 'Porco', emoji: '🐖', dezenas: ['69', '70', '71', '72'] },
  { grupo: 19, nome: 'Pavão', emoji: '🦚', dezenas: ['73', '74', '75', '76'] },
  { grupo: 20, nome: 'Peru', emoji: '🦃', dezenas: ['77', '78', '79', '80'] },
  { grupo: 21, nome: 'Touro', emoji: '🐂', dezenas: ['81', '82', '83', '84'] },
  { grupo: 22, nome: 'Tigre', emoji: '🐅', dezenas: ['85', '86', '87', '88'] },
  { grupo: 23, nome: 'Urso', emoji: '🐻', dezenas: ['89', '90', '91', '92'] },
  { grupo: 24, nome: 'Veado', emoji: '🦌', dezenas: ['93', '94', '95', '96'] },
  { grupo: 25, nome: 'Vaca', emoji: '🐄', dezenas: ['97', '98', '99', '00'] },
];

export function getGrupoFromDezena(dezenaInput: string | number): number {
  const num = typeof dezenaInput === 'string' ? parseInt(dezenaInput, 10) : dezenaInput;
  if (isNaN(num)) return 1;
  if (num === 0) return 25; // 00 pertence à Vaca (Grupo 25)
  return Math.ceil(num / 4);
}

export function getDezenasFromGrupo(grupo: number): string[] {
  const animal = ANIMAIS_BICHO.find(a => a.grupo === grupo);
  return animal ? animal.dezenas : [];
}

export function getAnimalByGrupo(grupo: number): AnimalInfo {
  const animal = ANIMAIS_BICHO.find(a => a.grupo === grupo);
  return animal || ANIMAIS_BICHO[0];
}

export function formatTwoDigits(val: number | string): string {
  const str = String(val).padStart(2, '0');
  return str.slice(-2);
}

export function formatFourDigits(val: number | string): string {
  return String(val).padStart(4, '0').slice(-4);
}

// 60+ historical realistic draws for instant analysis
export const HISTORICO_DEMO_PADRAO: DrawResult[] = [
  {
    id: 'res-001',
    data: '2026-09-18',
    extracao: 'CORUJA (21h)',
    loteria: 'RJ',
    premios: ['7423', '3891', '0165', '4580', '9112'],
    origem: 'demo',
    criadoEm: '2026-09-18T21:20:00'
  },
  {
    id: 'res-002',
    data: '2026-09-18',
    extracao: 'PTN (18h)',
    loteria: 'RJ',
    premios: ['1944', '8537', '2672', '6015', '4203'],
    origem: 'demo',
    criadoEm: '2026-09-18T18:20:00'
  },
  {
    id: 'res-003',
    data: '2026-09-18',
    extracao: 'PTV (16h)',
    loteria: 'RJ',
    premios: ['0829', '4410', '9356', '7184', '2947'],
    origem: 'demo',
    criadoEm: '2026-09-18T16:20:00'
  },
  {
    id: 'res-004',
    data: '2026-09-18',
    extracao: 'PT (14h)',
    loteria: 'RJ',
    premios: ['5317', '6892', '1241', '8033', '4776'],
    origem: 'demo',
    criadoEm: '2026-09-18T14:20:00'
  },
  {
    id: 'res-005',
    data: '2026-09-18',
    extracao: 'PTM (11h)',
    loteria: 'RJ',
    premios: ['3208', '7154', '8966', '0421', '6589'],
    origem: 'demo',
    criadoEm: '2026-09-18T11:20:00'
  },
  {
    id: 'res-006',
    data: '2026-09-17',
    extracao: 'CORUJA (21h)',
    loteria: 'RJ',
    premios: ['8945', '2160', '7302', '5819', '1478'],
    origem: 'demo',
    criadoEm: '2026-09-17T21:20:00'
  },
  {
    id: 'res-007',
    data: '2026-09-17',
    extracao: 'PTN (18h)',
    loteria: 'RJ',
    premios: ['6123', '9048', '3571', '4288', '0894'],
    origem: 'demo',
    criadoEm: '2026-09-17T18:20:00'
  },
  {
    id: 'res-008',
    data: '2026-09-17',
    extracao: 'PTV (16h)',
    loteria: 'RJ',
    premios: ['4782', '1355', '8204', '6931', '5067'],
    origem: 'demo',
    criadoEm: '2026-09-17T16:20:00'
  },
  {
    id: 'res-009',
    data: '2026-09-17',
    extracao: 'PT (14h)',
    loteria: 'RJ',
    premios: ['9503', '7468', '2119', '3842', '0699'],
    origem: 'demo',
    criadoEm: '2026-09-17T14:20:00'
  },
  {
    id: 'res-010',
    data: '2026-09-17',
    extracao: 'PTM (11h)',
    loteria: 'RJ',
    premios: ['2416', '8877', '5390', '1925', '7034'],
    origem: 'demo',
    criadoEm: '2026-09-17T11:20:00'
  },
  {
    id: 'res-011',
    data: '2026-09-16',
    extracao: 'FEDERAL (19h)',
    loteria: 'RJ',
    premios: ['0472', '8136', '2905', '7741', '5388'],
    origem: 'demo',
    criadoEm: '2026-09-16T19:20:00'
  },
  {
    id: 'res-012',
    data: '2026-09-16',
    extracao: 'PTV (16h)',
    loteria: 'RJ',
    premios: ['6814', '3028', '9551', '1497', '4263'],
    origem: 'demo',
    criadoEm: '2026-09-16T16:20:00'
  },
  {
    id: 'res-013',
    data: '2026-09-16',
    extracao: 'PT (14h)',
    loteria: 'RJ',
    premios: ['1739', '5983', '4622', '8307', '2146'],
    origem: 'demo',
    criadoEm: '2026-09-16T14:20:00'
  },
  {
    id: 'res-014',
    data: '2026-09-16',
    extracao: 'PTM (11h)',
    loteria: 'RJ',
    premios: ['7350', '2618', '8974', '0409', '6193'],
    origem: 'demo',
    criadoEm: '2026-09-16T11:20:00'
  },
  {
    id: 'res-015',
    data: '2026-09-15',
    extracao: 'CORUJA (21h)',
    loteria: 'RJ',
    premios: ['3967', '8424', '1501', '7238', '5085'],
    origem: 'demo',
    criadoEm: '2026-09-15T21:20:00'
  },
  {
    id: 'res-016',
    data: '2026-09-15',
    extracao: 'PTN (18h)',
    loteria: 'RJ',
    premios: ['9142', '0761', '6385', '4820', '2536'],
    origem: 'demo',
    criadoEm: '2026-09-15T18:20:00'
  },
  {
    id: 'res-017',
    data: '2026-09-15',
    extracao: 'PTV (16h)',
    loteria: 'RJ',
    premios: ['5209', '7833', '1496', '9670', '3158'],
    origem: 'demo',
    criadoEm: '2026-09-15T16:20:00'
  },
  {
    id: 'res-018',
    data: '2026-09-15',
    extracao: 'PT (14h)',
    loteria: 'RJ',
    premios: ['8675', '4126', '2981', '6304', '0549'],
    origem: 'demo',
    criadoEm: '2026-09-15T14:20:00'
  },
  {
    id: 'res-019',
    data: '2026-09-15',
    extracao: 'PTM (11h)',
    loteria: 'RJ',
    premios: ['4031', '9558', '3712', '8287', '1664'],
    origem: 'demo',
    criadoEm: '2026-09-15T11:20:00'
  },
  {
    id: 'res-020',
    data: '2026-09-14',
    extracao: 'CORUJA (21h)',
    loteria: 'RJ',
    premios: ['2852', '6415', '0979', '5130', '7308'],
    origem: 'demo',
    criadoEm: '2026-09-14T21:20:00'
  },
  {
    id: 'res-021',
    data: '2026-09-14',
    extracao: 'PTN (18h)',
    loteria: 'RJ',
    premios: ['6398', '1743', '8521', '3069', '9405'],
    origem: 'demo',
    criadoEm: '2026-09-14T18:20:00'
  },
  {
    id: 'res-022',
    data: '2026-09-14',
    extracao: 'PTV (16h)',
    loteria: 'RJ',
    premios: ['7511', '0862', '4935', '2280', '6177'],
    origem: 'demo',
    criadoEm: '2026-09-14T16:20:00'
  },
  {
    id: 'res-023',
    data: '2026-09-14',
    extracao: 'PT (14h)',
    loteria: 'RJ',
    premios: ['1086', '5427', '9373', '7840', '3619'],
    origem: 'demo',
    criadoEm: '2026-09-14T14:20:00'
  },
  {
    id: 'res-024',
    data: '2026-09-14',
    extracao: 'PTM (11h)',
    loteria: 'RJ',
    premios: ['8747', '3190', '6506', '0253', '4922'],
    origem: 'demo',
    criadoEm: '2026-09-14T11:20:00'
  },
  {
    id: 'res-025',
    data: '2026-09-13',
    extracao: 'FEDERAL (19h)',
    loteria: 'RJ',
    premios: ['9433', '5218', '1670', '8045', '3789'],
    origem: 'demo',
    criadoEm: '2026-09-13T19:20:00'
  },
  {
    id: 'res-026',
    data: '2026-09-13',
    extracao: 'PTV (16h)',
    loteria: 'RJ',
    premios: ['3562', '7984', '0417', '6128', '9859'],
    origem: 'demo',
    criadoEm: '2026-09-13T16:20:00'
  },
  {
    id: 'res-027',
    data: '2026-09-13',
    extracao: 'PT (14h)',
    loteria: 'RJ',
    premios: ['4295', '8601', '2348', '5766', '1074'],
    origem: 'demo',
    criadoEm: '2026-09-13T14:20:00'
  },
  {
    id: 'res-028',
    data: '2026-09-13',
    extracao: 'PTM (11h)',
    loteria: 'RJ',
    premios: ['0176', '4532', '9885', '7314', '6220'],
    origem: 'demo',
    criadoEm: '2026-09-13T11:20:00'
  },
  {
    id: 'res-029',
    data: '2026-09-12',
    extracao: 'CORUJA (21h)',
    loteria: 'RJ',
    premios: ['5821', '9403', '3157', '7692', '0346'],
    origem: 'demo',
    criadoEm: '2026-09-12T21:20:00'
  },
  {
    id: 'res-030',
    data: '2026-09-12',
    extracao: 'PTN (18h)',
    loteria: 'RJ',
    premios: ['2689', '6044', '8715', '1938', '4571'],
    origem: 'demo',
    criadoEm: '2026-09-12T18:20:00'
  },
  {
    id: 'res-031',
    data: '2026-09-12',
    extracao: 'PTV (16h)',
    loteria: 'RJ',
    premios: ['7904', '1368', '5429', '8850', '3279'],
    origem: 'demo',
    criadoEm: '2026-09-12T16:20:00'
  },
  {
    id: 'res-032',
    data: '2026-09-12',
    extracao: 'PT (14h)',
    loteria: 'RJ',
    premios: ['3457', '7810', '0293', '6142', '9586'],
    origem: 'demo',
    criadoEm: '2026-09-12T14:20:00'
  },
  {
    id: 'res-033',
    data: '2026-09-12',
    extracao: 'PTM (11h)',
    loteria: 'RJ',
    premios: ['8138', '2574', '6901', '4063', '1725'],
    origem: 'demo',
    criadoEm: '2026-09-12T11:20:00'
  },
  {
    id: 'res-034',
    data: '2026-09-11',
    extracao: 'CORUJA (21h)',
    loteria: 'RJ',
    premios: ['4670', '9025', '1387', '5812', '7439'],
    origem: 'demo',
    criadoEm: '2026-09-11T21:20:00'
  },
  {
    id: 'res-035',
    data: '2026-09-11',
    extracao: 'PTN (18h)',
    loteria: 'RJ',
    premios: ['1594', '6832', '4207', '8956', '0341'],
    origem: 'demo',
    criadoEm: '2026-09-11T18:20:00'
  },
  {
    id: 'res-036',
    data: '2026-09-11',
    extracao: 'PTV (16h)',
    loteria: 'RJ',
    premios: ['9248', '3661', '7019', '2483', '5170'],
    origem: 'demo',
    criadoEm: '2026-09-11T16:20:00'
  },
  {
    id: 'res-037',
    data: '2026-09-11',
    extracao: 'PT (14h)',
    loteria: 'RJ',
    premios: ['6705', '0198', '8534', '3921', '7846'],
    origem: 'demo',
    criadoEm: '2026-09-11T14:20:00'
  },
  {
    id: 'res-038',
    data: '2026-09-11',
    extracao: 'PTM (11h)',
    loteria: 'RJ',
    premios: ['2381', '7746', '3159', '9402', '6013'],
    origem: 'demo',
    criadoEm: '2026-09-11T11:20:00'
  },
  {
    id: 'res-039',
    data: '2026-09-10',
    extracao: 'CORUJA (21h)',
    loteria: 'RJ',
    premios: ['0863', '5219', '9674', '4135', '8598'],
    origem: 'demo',
    criadoEm: '2026-09-10T21:20:00'
  },
  {
    id: 'res-040',
    data: '2026-09-10',
    extracao: 'PTN (18h)',
    loteria: 'RJ',
    premios: ['7412', '1856', '6290', '0727', '3984'],
    origem: 'demo',
    criadoEm: '2026-09-10T18:20:00'
  }
];
