import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import AccessibilityMenu from './AccessibilityMenu';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Nova Manifestacao', href: '/nova-manifestacao' },
  { name: 'Consultar Protocolo', href: '/consulta' },
];


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="bg-primary-500 text-white shadow-lg">
      <nav className="container mx-auto px-4" aria-label="Navegacao principal">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 text-xl font-bold hover:opacity-90 transition-opacity"
              aria-label="Participa DF - Pagina inicial"
            >
              <div className="bg-white rounded-lg p-1.5">
                <img
                  src="/images/Bandeira_do_Distrito_Federal_Brasil.png"
                  alt="Bandeira do Distrito Federal"
                  className="h-6 w-auto"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold">Participa DF</span>
                <span className="text-xs font-normal opacity-80">Ouvidoria</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                  ? 'bg-white/20'
                  : 'hover:bg-white/10'
                  }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
            <AccessibilityMenu />
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <AccessibilityMenu />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden pb-4">
            <div className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                    ? 'bg-white/20'
                    : 'hover:bg-white/10'
                    }`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
