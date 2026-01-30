import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { authService } from '../../services';
import { useToast } from '../../contexts';
import type { DashboardStats } from '../../types';
import { TIPOS_MANIFESTACAO_LABELS } from '../../types';

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center">
        <div className={`${color} rounded-lg p-3`}>
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const toast = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await authService.getDashboardStats();
        setStats(data);
      } catch {
        toast.error('Erro', 'Não foi possível carregar as estatísticas.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Não foi possível carregar o dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral das manifestações</p>
        </div>
        <Link
          to="/admin/manifestacoes"
          className="flex items-center text-primary-500 hover:text-primary-600 font-medium"
        >
          Ver todas
          <ArrowRightIcon className="h-4 w-4 ml-1" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total"
          value={stats.total}
          icon={DocumentTextIcon}
          color="bg-primary-500"
        />
        <StatCard
          title="Recebidas"
          value={stats.recebidas}
          icon={ClockIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="Respondidas"
          value={stats.respondidas}
          icon={CheckCircleIcon}
          color="bg-green-500"
        />
        <StatCard
          title="Arquivadas"
          value={stats.arquivadas}
          icon={ArchiveBoxIcon}
          color="bg-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Por Tipo</h2>
          <div className="space-y-3">
            {Object.entries(stats.porTipo).map(([tipo, count]) => (
              <div key={tipo} className="flex items-center justify-between">
                <span className="text-gray-600">
                  {TIPOS_MANIFESTACAO_LABELS[tipo as keyof typeof TIPOS_MANIFESTACAO_LABELS]}
                </span>
                <span className="font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Por Órgão</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {Object.entries(stats.porOrgao)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([orgao, count]) => (
                <div key={orgao} className="flex items-center justify-between">
                  <span className="text-gray-600 truncate mr-4">{orgao}</span>
                  <span className="font-semibold text-gray-900 flex-shrink-0">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
