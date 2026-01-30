import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  show: boolean;
  onClose: () => void;
  type: ToastType;
  title: string;
  message?: string;
}

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationCircleIcon,
  info: InformationCircleIcon,
};

const styles = {
  success: 'bg-green-50 border-green-500 text-green-800',
  error: 'bg-red-50 border-red-500 text-red-800',
  warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
  info: 'bg-blue-50 border-blue-500 text-blue-800',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

export default function Toast({ show, onClose, type, title, message }: ToastProps) {
  const Icon = icons[type];

  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={`fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-lg border-l-4 p-4 shadow-lg ${styles[type]}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="flex items-start">
          <Icon className={`h-6 w-6 flex-shrink-0 ${iconStyles[type]}`} aria-hidden="true" />
          <div className="ml-3 flex-1">
            <p className="font-medium">{title}</p>
            {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 inline-flex flex-shrink-0 rounded-md p-1.5 hover:bg-white/50 transition-colors"
            aria-label="Fechar notificação"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Transition>
  );
}
