import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './ToastContext';

// Mock do componente Toast
vi.mock('../components/ui', () => ({
  Toast: ({ show, title, message, type, onClose }: {
    show: boolean; title: string; message?: string; type: string; onClose: () => void;
  }) => show ? (
    <div data-testid={`toast-${type}`} role="alert">
      <span>{title}</span>
      {message && <span>{message}</span>}
      <button onClick={onClose}>Fechar</button>
    </div>
  ) : null,
}));

// Mock crypto.randomUUID
let uuidCounter = 0;
vi.stubGlobal('crypto', {
  randomUUID: () => `uuid-${++uuidCounter}`,
});

function TestConsumer() {
  const toast = useToast();

  return (
    <div>
      <button onClick={() => toast.success('Sucesso', 'Operacao concluida')}>
        Toast Success
      </button>
      <button onClick={() => toast.error('Erro', 'Algo deu errado')}>
        Toast Error
      </button>
      <button onClick={() => toast.warning('Aviso')}>
        Toast Warning
      </button>
      <button onClick={() => toast.info('Info', 'Informacao')}>
        Toast Info
      </button>
    </div>
  );
}

describe('ToastContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    uuidCounter = 0;
  });

  it('deve exibir toast de sucesso', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    await user.click(screen.getByText('Toast Success'));

    expect(screen.getByTestId('toast-success')).toBeInTheDocument();
    expect(screen.getByText('Sucesso')).toBeInTheDocument();
    expect(screen.getByText('Operacao concluida')).toBeInTheDocument();
  });

  it('deve exibir toast de erro', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    await user.click(screen.getByText('Toast Error'));

    expect(screen.getByTestId('toast-error')).toBeInTheDocument();
    expect(screen.getByText('Algo deu errado')).toBeInTheDocument();
  });

  it('deve remover toast automaticamente apos 5 segundos', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    await user.click(screen.getByText('Toast Success'));
    expect(screen.getByTestId('toast-success')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByTestId('toast-success')).not.toBeInTheDocument();
  });

  it('deve remover toast ao clicar em fechar', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    await user.click(screen.getByText('Toast Success'));
    expect(screen.getByTestId('toast-success')).toBeInTheDocument();

    await user.click(screen.getByText('Fechar'));

    expect(screen.queryByTestId('toast-success')).not.toBeInTheDocument();
  });

  it('deve suportar multiplos toasts simultaneos', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    await user.click(screen.getByText('Toast Success'));
    await user.click(screen.getByText('Toast Error'));

    expect(screen.getByTestId('toast-success')).toBeInTheDocument();
    expect(screen.getByTestId('toast-error')).toBeInTheDocument();
  });

  it('useToast deve lancar erro fora do Provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      'useToast must be used within a ToastProvider'
    );

    consoleError.mockRestore();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});
