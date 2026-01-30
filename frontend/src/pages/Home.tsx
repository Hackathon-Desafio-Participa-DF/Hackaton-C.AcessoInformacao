import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: DocumentTextIcon,
    title: 'Multiplos Formatos',
    description: 'Registre sua manifestacao por texto, audio, imagem ou video.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Anonimato Opcional',
    description: 'Voce pode optar por nao se identificar ao registrar uma manifestacao.',
  },
  {
    icon: ClockIcon,
    title: 'Protocolo Imediato',
    description: 'Receba um numero de protocolo para acompanhar sua manifestacao.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Acompanhamento',
    description: 'Consulte o status e as respostas da sua manifestacao a qualquer momento.',
  },
];

const manifestationTypes = [
  {
    title: 'Reclamacao',
    description: 'Relate problemas ou insatisfacoes com servicos publicos.',
    color: 'bg-red-100 text-red-700',
  },
  {
    title: 'Sugestao',
    description: 'Proponha melhorias para os servicos publicos.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Elogio',
    description: 'Reconheca o bom trabalho de servidores ou orgaos.',
    color: 'bg-green-100 text-green-700',
  },
  {
    title: 'Denuncia',
    description: 'Reporte irregularidades ou condutas inadequadas.',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    title: 'Solicitacao',
    description: 'Peca informacoes ou servicos ao governo.',
    color: 'bg-purple-100 text-purple-700',
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center py-8 px-4 bg-gradient-to-b from-primary-50 to-white -mx-4 -mt-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao Participa DF
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          O canal de comunicacao entre voce e o Governo do Distrito Federal.
          Sua participacao e fundamental para melhorarmos os servicos publicos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link
            to="/nova-manifestacao"
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-primary-100 hover:border-primary-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-500/10 group-hover:from-primary-500/10 group-hover:to-primary-500/20 transition-all" />
            <div className="relative p-6">
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-primary-50 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-colors p-4">
                  <img
                    src="/images/LogoOuvidoriaDoGovernoDoDistritoFederal.svg"
                    alt="Logo da Ouvidoria do Governo do Distrito Federal"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                Nova Manifestacao
              </h2>
              <p className="text-gray-600 mb-4">
                Registre sua reclamacao, sugestao, elogio, denuncia ou solicitacao
              </p>
              <div className="inline-flex items-center justify-center w-full py-3 px-6 bg-primary-500 text-white font-semibold rounded-xl group-hover:bg-primary-600 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Registrar Agora
              </div>
            </div>
          </Link>

          <Link
            to="/consulta"
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-secondary-100 hover:border-secondary-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/5 to-secondary-500/10 group-hover:from-secondary-500/10 group-hover:to-secondary-500/20 transition-all" />
            <div className="relative p-6">
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-secondary-50 rounded-full flex items-center justify-center group-hover:bg-secondary-100 transition-colors">
                  <svg className="w-20 h-20 md:w-24 md:h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="25" y="15" width="50" height="70" rx="5" fill="#006341" opacity="0.2" />
                    <rect x="25" y="15" width="50" height="15" rx="5" fill="#006341" />
                    <text x="50" y="27" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">PROTOCOLO</text>
                    <rect x="32" y="38" width="3" height="15" fill="#333" />
                    <rect x="37" y="38" width="2" height="15" fill="#333" />
                    <rect x="41" y="38" width="4" height="15" fill="#333" />
                    <rect x="47" y="38" width="2" height="15" fill="#333" />
                    <rect x="51" y="38" width="3" height="15" fill="#333" />
                    <rect x="56" y="38" width="4" height="15" fill="#333" />
                    <rect x="62" y="38" width="2" height="15" fill="#333" />
                    <text x="50" y="62" fontSize="7" fill="#333" textAnchor="middle" fontFamily="monospace">2024-000001</text>
                    <line x1="32" y1="70" x2="68" y2="70" stroke="#E0E0E0" strokeWidth="2" />
                    <line x1="32" y1="76" x2="60" y2="76" stroke="#E0E0E0" strokeWidth="2" />
                    <circle cx="78" cy="70" r="15" fill="none" stroke="#FFC300" strokeWidth="4" />
                    <line x1="88" y1="80" x2="96" y2="90" stroke="#FFC300" strokeWidth="5" strokeLinecap="round" />
                    <path d="M72 70 L76 74 L84 66" stroke="#006341" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-secondary-600 transition-colors">
                Consultar Protocolo
              </h2>
              <p className="text-gray-600 mb-4">
                Acompanhe o andamento da sua manifestacao pelo numero do protocolo
              </p>
              <div className="inline-flex items-center justify-center w-full py-3 px-6 bg-secondary-500 text-gray-900 font-semibold rounded-xl group-hover:bg-secondary-400 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Consultar Agora
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section aria-labelledby="types-heading" className="bg-gray-50 -mx-4 px-4 py-12 rounded-xl">
        <h2 id="types-heading" className="text-2xl font-bold text-gray-900 text-center mb-8">
          Tipos de Manifestacao
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {manifestationTypes.map((type) => (
            <div
              key={type.title}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${type.color} mb-2`}>
                {type.title}
              </span>
              <p className="text-gray-600 text-sm">{type.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="cta-heading" className="text-center py-8">
        <div className="bg-primary-500 text-white rounded-2xl p-8 md:p-12">
          <UserGroupIcon className="h-16 w-16 mx-auto mb-4 opacity-90" aria-hidden="true" />
          <h2 id="cta-heading" className="text-2xl md:text-3xl font-bold mb-4">
            Sua voz importa!
          </h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto mb-6">
            Contribua para a melhoria dos servicos publicos do Distrito Federal.
            Cada manifestacao e analisada e pode fazer a diferenca.
          </p>
          <Link
            to="/nova-manifestacao"
            className="inline-flex items-center justify-center py-3 px-8 bg-secondary-500 text-gray-900 font-semibold rounded-xl hover:bg-secondary-400 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Registrar Manifestacao
          </Link>
        </div>
      </section>
    </div>
  );
}
