import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, ToastProvider } from './contexts';
import { Layout } from './components/layout';
import { AdminLayout, ProtectedRoute } from './components/admin';
import { Home, NovaManifestacao, ConsultaProtocolo, Sucesso } from './pages';
import { Login, Dashboard, ManifestacaoList, ManifestacaoDetail } from './pages/admin';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/nova-manifestacao" element={<NovaManifestacao />} />
              <Route path="/consulta" element={<ConsultaProtocolo />} />
              <Route path="/sucesso/:protocolo" element={<Sucesso />} />
            </Route>

            <Route path="/admin/login" element={<Login />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="manifestacoes" element={<ManifestacaoList />} />
              <Route path="manifestacoes/:id" element={<ManifestacaoDetail />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
