import React, { useState } from 'react';
import {
  History,
  Plus,
  Upload,
  Download,
  Trash2,
  Edit2,
  Search,
  Filter,
  Check,
  AlertTriangle,
  RotateCcw,
  FileSpreadsheet,
  FileCode,
  Calendar,
  X
} from 'lucide-react';
import { DrawResult } from '../types';
import { getAnimalByGrupo, formatTwoDigits, HISTORICO_DEMO_PADRAO } from '../data/bichoData';

interface HistoricoViewProps {
  draws: DrawResult[];
  onAddDraw: (draw: DrawResult) => void;
  onEditDraw: (draw: DrawResult) => void;
  onDeleteDraw: (id: string) => void;
  onRestoreDemo: () => void;
  onImportDraws: (imported: DrawResult[]) => void;
}

export const HistoricoView: React.FC<HistoricoViewProps> = ({
  draws,
  onAddDraw,
  onEditDraw,
  onDeleteDraw,
  onRestoreDemo,
  onImportDraws
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExtracao, setSelectedExtracao] = useState('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDraw, setEditingDraw] = useState<DrawResult | null>(null);

  // Form states for manual entry/edit
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    extracao: 'PTM (11h)',
    loteria: 'RJ',
    p1: '1234',
    p2: '5678',
    p3: '9012',
    p4: '3456',
    p5: '7890'
  });

  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingDraw(null);
    setFormData({
      data: new Date().toISOString().split('T')[0],
      extracao: 'PTM (11h)',
      loteria: 'RJ',
      p1: '',
      p2: '',
      p3: '',
      p4: '',
      p5: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (draw: DrawResult) => {
    setEditingDraw(draw);
    setFormData({
      data: draw.data,
      extracao: draw.extracao,
      loteria: draw.loteria || 'RJ',
      p1: draw.premios[0] || '',
      p2: draw.premios[1] || '',
      p3: draw.premios[2] || '',
      p4: draw.premios[3] || '',
      p5: draw.premios[4] || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanThousands = [
      formData.p1.padStart(4, '0').slice(-4),
      formData.p2.padStart(4, '0').slice(-4),
      formData.p3.padStart(4, '0').slice(-4),
      formData.p4.padStart(4, '0').slice(-4),
      formData.p5.padStart(4, '0').slice(-4),
    ];

    if (editingDraw) {
      onEditDraw({
        ...editingDraw,
        data: formData.data,
        extracao: formData.extracao,
        loteria: formData.loteria,
        premios: cleanThousands,
        origem: 'manual'
      });
    } else {
      const newDraw: DrawResult = {
        id: `man-${Date.now()}`,
        data: formData.data,
        extracao: formData.extracao,
        loteria: formData.loteria,
        premios: cleanThousands,
        origem: 'manual',
        criadoEm: new Date().toISOString()
      };
      onAddDraw(newDraw);
    }
    setIsModalOpen(false);
  };

  // CSV Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(null);

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const text = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (!Array.isArray(parsed)) throw new Error('O arquivo JSON deve conter um array de sorteios.');
          onImportDraws(parsed);
          setImportSuccess(`${parsed.length} sorteios importados com sucesso.`);
        } else {
          // CSV Parser
          const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          if (lines.length < 2) throw new Error('Arquivo CSV vazio ou sem cabeçalho.');

          const importedList: DrawResult[] = [];
          // Expected header: data,extracao,premio1,premio2,premio3,premio4,premio5
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
            if (cols.length >= 6) {
              importedList.push({
                id: `imp-${Date.now()}-${i}`,
                data: cols[0],
                extracao: cols[1],
                loteria: cols[7] || 'RJ',
                premios: [cols[2], cols[3], cols[4], cols[5], cols[6] || '0000'].map(m => m.padStart(4, '0').slice(-4)),
                origem: 'importado',
                criadoEm: new Date().toISOString()
              });
            }
          }

          if (importedList.length === 0) throw new Error('Nenhum sorteio válido encontrado no CSV.');
          onImportDraws(importedList);
          setImportSuccess(`${importedList.length} sorteios importados via CSV com sucesso!`);
        }
      } catch (err: any) {
        setImportError(`Erro na importação: ${err.message || 'Formato de arquivo inválido'}`);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(draws, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bicho-analyzer-historico-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['data', 'extracao', 'premio1', 'premio2', 'premio3', 'premio4', 'premio5', 'loteria'];
    const rows = draws.map(d => [
      d.data,
      `"${d.extracao}"`,
      d.premios[0] || '',
      d.premios[1] || '',
      d.premios[2] || '',
      d.premios[3] || '',
      d.premios[4] || '',
      `"${d.loteria || 'RJ'}"`
    ].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bicho-analyzer-historico-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Download Sample CSV
  const handleDownloadSampleCSV = () => {
    const sample = `data,extracao,premio1,premio2,premio3,premio4,premio5,loteria\n2026-09-18,PTM (11h),3208,7154,8966,0421,6589,RJ\n2026-09-18,PT (14h),5317,6892,1241,8033,4776,RJ`;
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `modelo-exemplo-sorteios.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filtered draws
  const filteredDraws = draws.filter(d => {
    const matchesSearch =
      d.data.includes(searchTerm) ||
      d.extracao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.premios.some(p => p.includes(searchTerm));
    const matchesExtracao =
      selectedExtracao === 'todas' || d.extracao.toLowerCase().includes(selectedExtracao.toLowerCase());
    return matchesSearch && matchesExtracao;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/80 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
              <History className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                BASE DE DADOS HISTÓRICA
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {draws.length} Registros
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Gerencie todos os resultados que alimentam o motor estatístico: adicione manualmente, importe ou exporte planilhas.
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition cursor-pointer active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Inserir Sorteio Manual</span>
            </button>

            {/* Hidden file input for import */}
            <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer">
              <Upload className="h-4 w-4 text-emerald-400" />
              <span>Importar CSV/JSON</span>
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Exportar base completa para CSV"
            >
              <FileSpreadsheet className="h-4 w-4 text-cyan-400" />
              <span>CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Exportar base completa para JSON"
            >
              <FileCode className="h-4 w-4 text-amber-400" />
              <span>JSON</span>
            </button>

            <button
              onClick={onRestoreDemo}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
              title="Restaurar dados históricos de demonstração padrão"
            >
              <RotateCcw className="h-4 w-4 text-purple-400" />
              <span className="hidden sm:inline">Restaurar Demo</span>
            </button>
          </div>
        </div>

        {/* Feedback alerts */}
        {importError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{importError}</span>
            </div>
            <button onClick={() => setImportError(null)} className="text-rose-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {importSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{importSuccess}</span>
            </div>
            <button onClick={() => setImportSuccess(null)} className="text-emerald-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar data, extração ou milhar..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Filter className="h-3.5 w-3.5" />
              <span>Extração:</span>
            </div>
            <select
              value={selectedExtracao}
              onChange={e => setSelectedExtracao(e.target.value)}
              className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="todas">Todas as Extrações</option>
              <option value="PTM">PTM (11h)</option>
              <option value="PT">PT (14h)</option>
              <option value="PTV">PTV (16h)</option>
              <option value="PTN">PTN (18h)</option>
              <option value="FED">Federal (19h)</option>
              <option value="COR">Coruja (21h)</option>
            </select>

            <button
              onClick={handleDownloadSampleCSV}
              className="text-[11px] text-emerald-400 hover:underline pl-2 cursor-pointer"
            >
              Baixar Modelo CSV
            </button>
          </div>
        </div>
      </div>

      {/* Historical Results Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Data / Horário</th>
                <th className="py-3 px-4 font-semibold">1º Prêmio (Cabeça)</th>
                <th className="py-3 px-4 font-semibold">2º Prêmio</th>
                <th className="py-3 px-4 font-semibold">3º Prêmio</th>
                <th className="py-3 px-4 font-semibold">4º Prêmio</th>
                <th className="py-3 px-4 font-semibold">5º Prêmio</th>
                <th className="py-3 px-4 font-semibold">Origem</th>
                <th className="py-3 px-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDraws.length > 0 ? (
                filteredDraws.map((draw) => {
                  const m1 = draw.premios[0] || '0000';
                  const d1 = m1.slice(-2);
                  const g1 = Math.ceil(parseInt(d1, 10) === 0 ? 25 : parseInt(d1, 10) / 4);
                  const animal1 = getAnimalByGrupo(g1);

                  return (
                    <tr key={draw.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-white">{draw.data}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <span>{draw.extracao}</span>
                          <span className="text-slate-400">•</span>
                          <span>{draw.loteria || 'RJ'}</span>
                        </div>
                      </td>

                      {/* 1º Prêmio */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400 text-sm">
                            {m1}
                          </span>
                          <span className="text-base">{animal1.emoji}</span>
                          <span className="text-[11px] text-slate-300">
                            G{formatTwoDigits(g1)} ({animal1.nome})
                          </span>
                        </div>
                      </td>

                      {/* 2º ao 5º */}
                      {draw.premios.slice(1, 5).map((premio, pIdx) => {
                        const dez = premio.slice(-2);
                        const grp = Math.ceil(parseInt(dez, 10) === 0 ? 25 : parseInt(dez, 10) / 4);
                        const ani = getAnimalByGrupo(grp);
                        return (
                          <td key={pIdx} className="py-3 px-4 whitespace-nowrap font-mono text-slate-300">
                            <div>{premio}</div>
                            <div className="text-[10px] text-slate-400 font-sans">
                              G{formatTwoDigits(grp)} {ani.emoji}
                            </div>
                          </td>
                        );
                      })}

                      {/* Origin Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                          draw.origem === 'manual'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : draw.origem === 'importado'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {draw.origem}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-right space-x-1">
                        <button
                          onClick={() => openEditModal(draw)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                          title="Editar resultado"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteDraw(draw.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                          title="Excluir resultado"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    Nenhum resultado encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Draw Modal (Add / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-400" />
                <span>{editingDraw ? 'Editar Resultado' : 'Novo Resultado Histórico'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Data do Sorteio</label>
                  <input
                    type="date"
                    required
                    value={formData.data}
                    onChange={e => setFormData({ ...formData, data: e.target.value })}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Horário / Extração</label>
                  <select
                    value={formData.extracao}
                    onChange={e => setFormData({ ...formData, extracao: e.target.value })}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="PTM (11h)">PTM (11h)</option>
                    <option value="PT (14h)">PT (14h)</option>
                    <option value="PTV (16h)">PTV (16h)</option>
                    <option value="PTN (18h)">PTN (18h)</option>
                    <option value="FEDERAL (19h)">FEDERAL (19h)</option>
                    <option value="CORUJA (21h)">CORUJA (21h)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Prêmios de 1º a 5º (Milhar de 4 dígitos)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { key: 'p1', label: '1º Prêmio' },
                    { key: 'p2', label: '2º Prêmio' },
                    { key: 'p3', label: '3º Prêmio' },
                    { key: 'p4', label: '4º Prêmio' },
                    { key: 'p5', label: '5º Prêmio' },
                  ].map(f => (
                    <div key={f.key}>
                      <span className="block text-[10px] text-slate-400 mb-0.5">{f.label}</span>
                      <input
                        type="text"
                        maxLength={4}
                        required
                        placeholder="0000"
                        value={(formData as any)[f.key]}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            [f.key]: e.target.value.replace(/\D/g, '')
                          })
                        }
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-2 py-1.5 text-center font-mono font-bold text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  {editingDraw ? 'Salvar Alterações' : 'Cadastrar Sorteio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
