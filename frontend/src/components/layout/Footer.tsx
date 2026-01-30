import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Participa DF</h2>
            <p className="text-gray-300 text-sm">
              Sistema de Ouvidoria do Governo do Distrito Federal.
              Sua participação é fundamental para a melhoria dos serviços públicos.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Links Úteis</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/nova-manifestacao"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Registrar Manifestação
                </Link>
              </li>
              <li>
                <Link
                  to="/consulta"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Consultar Protocolo
                </Link>
              </li>
              <li>
                <a
                  href="https://www.df.gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Portal GDF
                  <span className="sr-only"> (abre em nova janela)</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Contato</h2>
            <address className="text-gray-300 text-sm not-italic space-y-2">
              <p>Controladoria-Geral do Distrito Federal</p>
              <p>
                <a
                  href="tel:162"
                  className="hover:text-white transition-colors"
                >
                  Central 162
                </a>
              </p>
              <p>
                <a
                  href="mailto:ouvidoria@cg.df.gov.br"
                  className="hover:text-white transition-colors"
                >
                  ouvidoria@cg.df.gov.br
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            © {currentYear} Governo do Distrito Federal. Todos os direitos reservados.
          </p>
          <p className="mt-2">
            Desenvolvido em conformidade com as diretrizes de acessibilidade WCAG 2.1 AA
          </p>
        </div>
      </div>
    </footer>
  );
}
