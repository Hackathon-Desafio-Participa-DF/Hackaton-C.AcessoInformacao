import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '../services';

vi.mock('../services', () => ({
  authService: {
    getStoredGestor: vi.fn(),
    isAuthenticated: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

const mockGestor = {
  id: 'gestor-1',
  nome: 'Admin',
  email: 'admin@cgdf.gov.br',
  orgao: 'CGDF',
};

function TestConsumer() {
  const { gestor, isAuthenticated, isLoading, login, logout } = useAuth();

  return (
    <div>
      <span data-testid="loading">{isLoading ? 'loading' : 'ready'}</span>
      <span data-testid="authenticated">{isAuthenticated ? 'yes' : 'no'}</span>
      <span data-testid="gestor">{gestor?.nome ?? 'none'}</span>
      <button onClick={() => login('admin@cgdf.gov.br', 'admin123')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar sem autenticacao', async () => {
    vi.mocked(authService.getStoredGestor).mockReturnValue(null);
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
    expect(screen.getByTestId('gestor')).toHaveTextContent('none');
  });

  it('deve restaurar sessao do localStorage', async () => {
    vi.mocked(authService.getStoredGestor).mockReturnValue(mockGestor);
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
    expect(screen.getByTestId('gestor')).toHaveTextContent('Admin');
  });

  it('deve fazer login com sucesso', async () => {
    vi.mocked(authService.getStoredGestor).mockReturnValue(null);
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);
    vi.mocked(authService.login).mockResolvedValue({
      token: 'jwt-token',
      gestor: mockGestor,
    });

    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    await user.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
    });

    expect(screen.getByTestId('gestor')).toHaveTextContent('Admin');
    expect(authService.login).toHaveBeenCalledWith({
      email: 'admin@cgdf.gov.br',
      senha: 'admin123',
    });
  });

  it('deve fazer logout', async () => {
    vi.mocked(authService.getStoredGestor).mockReturnValue(mockGestor);
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);

    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
    });

    await user.click(screen.getByText('Logout'));

    expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
    expect(screen.getByTestId('gestor')).toHaveTextContent('none');
    expect(authService.logout).toHaveBeenCalled();
  });

  it('useAuth deve lancar erro fora do Provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    consoleError.mockRestore();
  });
});
