import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Button, Select, Input } from '../../components/ui';
import { manifestacaoService } from '../../services';
import { useToast } from '../../contexts';
import type { Manifestacao, TipoManifestacao, StatusManifestacao } from '../../types';
import {
  TIPOS_MANIFESTACAO_LABELS,
  STATUS_LABELS,
  ORGAOS_DF,
} from '../../types';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

const statusColors: Record<string, string> = {
  RECEBIDA: 'bg-blue-100 text-blue-800',
  EM_ANALISE: 'bg-yellow-100 text-yellow-800',
  RESPONDIDA: 'bg-green-100 text-green-800',
  ARQUIVADA: 'bg-gray-100 text-gray-800',
};

export default function ManifestacaoList() {
  const toast = useToast();
  const [manifestacoes, setManifestacoes] = useState<Manifestacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    status: '',
    tipo: '',
    orgao: '',
    search: '',
  });

  const tipoOptions = [
    { value: '', label: 'Todos os tipos' },
    ...Object.entries(TIPOS_MANIFESTACAO_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  const orgaoOptions = [
    { value: '', label: 'Todos os órgãos' },
    ...ORGAOS_DF.map((orgao) => ({ value: orgao, label: orgao })),
  ];

  const fetchManifestacoes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await manifestacaoService.list({
        page,
        limit: 10,
        ...filters,
      });
      setManifestacoes(data.manifestacoes);
      setTotalPages(data.totalPages);
    } catch {
      toast.error('Erro', 'Não foi possível carregar as manifestações.');
    } finally {
      setIsLoading(false);
    }
  }, [page, filters, toast]);

  useEffect(() => {
    fetchManifestacoes();
  }, [fetchManifestacoes]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manifestações</h1>
          <p className="text-gray-600">Gerencie as manifestações recebidas</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          leftIcon={<FunnelIcon className="h-4 w-4" aria-hidden="true" />}
        >
          Filtros
        </Button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Buscar"
              placeholder="Protocolo ou descrição"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <Select
              label="Tipo"
              options={tipoOptions}
              value={filters.tipo}
              onChange={(e) => handleFilterChange('tipo', e.target.value)}
            />
            <Select
              label="Status"
              options={statusOptions}
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            />
            <Select
              label="Órgão"
              options={orgaoOptions}
              value={filters.orgao}
              onChange={(e) => handleFilterChange('orgao', e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
          </div>
        ) : manifestacoes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma manifestação encontrada.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Protocolo
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tipo
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Órgão
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Data
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {manifestacoes.map((manifestacao) => (
                    <tr key={manifestacao.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {manifestacao.protocolo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {TIPOS_MANIFESTACAO_LABELS[manifestacao.tipo as TipoManifestacao]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 line-clamp-1">
                          {manifestacao.orgao}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[manifestacao.status]}`}
                        >
                          {STATUS_LABELS[manifestacao.status as StatusManifestacao]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(manifestacao.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link
                          to={`/admin/manifestacoes/${manifestacao.id}`}
                          className="text-primary-500 hover:text-primary-600"
                        >
                          <EyeIcon className="h-5 w-5 inline" aria-hidden="true" />
                          <span className="sr-only">Ver detalhes</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Página {page} de {totalPages}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
