import { ManifestacaoForm } from '../components/forms';

export default function NovaManifestacao() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Nova Manifestação
        </h1>
        <p className="text-gray-600">
          Preencha o formulário abaixo para registrar sua manifestação.
          Campos marcados com <span className="text-red-500">*</span> são obrigatórios.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <ManifestacaoForm />
      </div>
    </div>
  );
}
