import { Fragment, useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  SunIcon,
  MoonIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

export default function AccessibilityMenu() {
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 10, 150));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 10, 80));
  };

  const resetFontSize = () => {
    setFontSize(100);
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
  };

  return (
    <Menu as="div" className="relative">
      <MenuButton
        className="flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Menu de acessibilidade"
      >
        <AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Acessibilidade
            </p>

            <MenuItem>
              <button
                onClick={increaseFontSize}
                disabled={fontSize >= 150}
                className="flex w-full items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MagnifyingGlassPlusIcon className="h-5 w-5 mr-3" aria-hidden="true" />
                Aumentar fonte
                <span className="ml-auto text-xs text-gray-500">{fontSize}%</span>
              </button>
            </MenuItem>

            <MenuItem>
              <button
                onClick={decreaseFontSize}
                disabled={fontSize <= 80}
                className="flex w-full items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MagnifyingGlassMinusIcon className="h-5 w-5 mr-3" aria-hidden="true" />
                Diminuir fonte
              </button>
            </MenuItem>

            <MenuItem>
              <button
                onClick={resetFontSize}
                className="flex w-full items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
              >
                <span className="h-5 w-5 mr-3 flex items-center justify-center text-xs font-bold" aria-hidden="true">
                  A
                </span>
                Fonte padrão
              </button>
            </MenuItem>

            <div className="border-t border-gray-100 my-1" />

            <MenuItem>
              <button
                onClick={toggleHighContrast}
                className="flex w-full items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                aria-pressed={highContrast}
              >
                {highContrast ? (
                  <SunIcon className="h-5 w-5 mr-3" aria-hidden="true" />
                ) : (
                  <MoonIcon className="h-5 w-5 mr-3" aria-hidden="true" />
                )}
                {highContrast ? 'Contraste normal' : 'Alto contraste'}
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
