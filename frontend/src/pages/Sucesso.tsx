import { useParams, Link } from 'react-router-dom';
import { CheckCircleIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui';
import { useToast } from '../contexts';

export default function Sucesso() {
  const { protocolo } = useParams<{ protocolo: string }>();
  const toast = useToast();

  const handleCopyProtocolo = async () => {
    if (protocolo) {
      try {
        await navigator.clipboard.writeText(protocolo);
        toast.success('Copiado!', 'Protocolo copiado para a área de transferência.');
      } catch {
        toast.error('Erro', 'Não foi possível copiar o protocolo.');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <CheckCircleIcon className="h-12 w-12 text-green-600" aria-hidden="true" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Manifestação Registrada com Sucesso!
      </h1>

      <p className="text-gray-600 mb-8">
        Sua manifestação foi recebida e será analisada pelos órgãos competentes.
        Guarde o número do protocolo para acompanhar o status.
      </p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <p className="text-sm text-gray-500 mb-2">Número do Protocolo</p>
        <div className="flex items-center justify-center gap-4">
          <p className="text-3xl font-bold text-primary-500">{protocolo}</p>
          <button
            onClick={handleCopyProtocolo}
            className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
            aria-label="Copiar protocolo"
            title="Copiar protocolo"
          >
            <DocumentDuplicateIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left">
        <p className="text-yellow-800 font-medium mb-1">Importante</p>
        <p className="text-yellow-700 text-sm">
          Anote ou salve o número do protocolo. Você precisará dele para consultar
          o status da sua manifestação e verificar possíveis respostas.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to={`/consulta`}>
          <Button variant="outline">Consultar Status</Button>
        </Link>
        <Link to="/nova-manifestacao">
          <Button>Nova Manifestação</Button>
        </Link>
        <Link to="/">
          <Button variant="ghost">Voltar ao Início</Button>
        </Link>
      </div>
    </div>
  );
}
