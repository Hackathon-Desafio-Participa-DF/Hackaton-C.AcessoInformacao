import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select, Textarea, Checkbox } from '../ui';
import AudioRecorder from './AudioRecorder';
import FileUpload from './FileUpload';
import { useToast } from '../../contexts';
import { manifestacaoService, uploadService } from '../../services';
import {
  TipoManifestacao,
  TIPOS_MANIFESTACAO_LABELS,
  ORGAOS_DF,
  HORARIOS_FATO,
  type ManifestacaoInput,
} from '../../types';

type InputMode = 'text' | 'audio';

interface FormData {
  tipo: TipoManifestacao | '';
  orgao: string;
  assunto: string;
  dataFato: string;
  horarioFato: string;
  local: string;
  pessoasEnvolvidas: string;
  relato: string;
  anonimo: boolean;
  nome: string;
  email: string;
  telefone: string;
}

interface FormErrors {
  tipo?: string;
  orgao?: string;
  assunto?: string;
  relato?: string;
  nome?: string;
  email?: string;
}

export default function ManifestacaoForm() {
  const navigate = useNavigate();
  const toast = useToast();

  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [formData, setFormData] = useState<FormData>({
    tipo: '',
    orgao: '',
    assunto: '',
    dataFato: '',
    horarioFato: '',
    local: '',
    pessoasEnvolvidas: '',
    relato: '',
    anonimo: false,
    nome: '',
    email: '',
    telefone: '',
  });
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tipoOptions = Object.entries(TIPOS_MANIFESTACAO_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const orgaoOptions = ORGAOS_DF.map((orgao) => ({ value: orgao, label: orgao }));
  const horarioOptions = HORARIOS_FATO.map((h) => ({ value: h.value, label: h.label }));

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, anonimo: e.target.checked }));
  };

  const handleAudioRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
    toast.success('Audio gravado', 'Seu audio foi gravado com sucesso.');
  };

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.tipo) {
      newErrors.tipo = 'Selecione o tipo de manifestacao';
    }

    if (!formData.orgao) {
      newErrors.orgao = 'Selecione o orgao destinatario';
    }

    if (!formData.assunto.trim()) {
      newErrors.assunto = 'Informe o assunto da manifestacao';
    }

    if (inputMode === 'text' && !formData.relato.trim()) {
      newErrors.relato = 'Descreva os detalhes da sua manifestacao';
    }

    if (inputMode === 'audio' && !audioBlob) {
      newErrors.relato = 'Grave um audio com os detalhes da sua manifestacao';
    }

    if (!formData.anonimo) {
      if (!formData.nome.trim()) {
        newErrors.nome = 'Informe seu nome';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Informe seu e-mail';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'E-mail invalido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Formulario invalido', 'Corrija os erros indicados.');
      return;
    }

    setIsSubmitting(true);

    try {
      let audioUrl: string | undefined;
      const anexosUrls: string[] = [];

      if (audioBlob) {
        const uploadResult = await uploadService.uploadAudio(audioBlob);
        audioUrl = uploadResult.url;
      }

      for (const file of files) {
        const uploadResult = await uploadService.uploadFile(file);
        anexosUrls.push(uploadResult.url);
      }

      const manifestacaoData: ManifestacaoInput = {
        tipo: formData.tipo as TipoManifestacao,
        orgao: formData.orgao,
        assunto: formData.assunto,
        dataFato: formData.dataFato || undefined,
        horarioFato: formData.horarioFato || undefined,
        local: formData.local || undefined,
        pessoasEnvolvidas: formData.pessoasEnvolvidas || undefined,
        relato: inputMode === 'text' ? formData.relato : undefined,
        audioUrl,
        anonimo: formData.anonimo,
        nome: formData.anonimo ? undefined : formData.nome,
        email: formData.anonimo ? undefined : formData.email,
        telefone: formData.anonimo ? undefined : formData.telefone || undefined,
        anexos: anexosUrls.length > 0 ? anexosUrls : undefined,
      };

      const result = await manifestacaoService.create(manifestacaoData);

      toast.success('Manifestacao registrada', `Protocolo: ${result.protocolo}`);
      navigate(`/sucesso/${result.protocolo}`);
    } catch {
      toast.error('Erro ao enviar', 'Tente novamente em alguns instantes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <fieldset className="space-y-6">
        <legend className="text-lg font-semibold text-gray-900 mb-4">
          Relato
        </legend>

        <div>
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Como voce deseja registrar seu relato?
          </p>
          <div className="flex space-x-4" role="radiogroup" aria-label="Modo de entrada do relato">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="inputMode"
                value="text"
                checked={inputMode === 'text'}
                onChange={() => setInputMode('text')}
                className="h-4 w-4 text-primary-500 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Texto escrito</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="inputMode"
                value="audio"
                checked={inputMode === 'audio'}
                onChange={() => setInputMode('audio')}
                className="h-4 w-4 text-primary-500 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Gravacao de audio</span>
            </label>
          </div>
        </div>

        {inputMode === 'text' ? (
          <Textarea
            label="Descreva seu relato"
            name="relato"
            value={formData.relato}
            onChange={handleInputChange}
            placeholder="Descreva detalhadamente os fatos, incluindo informacoes como numeros de placas de carro, linhas de onibus, nome dos estabelecimentos, etc."
            error={errors.relato}
            rows={6}
            required
            helperText="Inclua todos os detalhes relevantes para analise da sua manifestacao"
          />
        ) : (
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Gravacao de Audio <span className="text-red-500">*</span>
            </p>
            <AudioRecorder
              onRecordingComplete={handleAudioRecordingComplete}
              disabled={isSubmitting}
            />
            {errors.relato && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.relato}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Grave um audio descrevendo os detalhes da sua manifestacao
            </p>
          </div>
        )}

        <div>
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Anexos (opcional)
          </p>
          <FileUpload
            onFilesChange={handleFilesChange}
            maxFiles={5}
            maxSizeMB={50}
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-gray-500">
            Voce pode anexar imagens e videos para complementar sua manifestacao.
          </p>
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-lg font-semibold text-gray-900 mb-4">
          Dados da Manifestacao
        </legend>

        <Select
          label="Tipo de Manifestacao"
          name="tipo"
          options={tipoOptions}
          value={formData.tipo}
          onChange={handleInputChange}
          placeholder="Selecione o tipo"
          error={errors.tipo}
          required
        />

        <Select
          label="Orgao Destinatario"
          name="orgao"
          options={orgaoOptions}
          value={formData.orgao}
          onChange={handleInputChange}
          placeholder="Selecione o orgao"
          error={errors.orgao}
          required
        />

        <Input
          label="Assunto (O que?)"
          name="assunto"
          type="text"
          value={formData.assunto}
          onChange={handleInputChange}
          error={errors.assunto}
          placeholder="Descreva brevemente o objeto da demanda"
          helperText="Informe de forma resumida o assunto da sua manifestacao"
          required
        />
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-lg font-semibold text-gray-900 mb-4">
          Detalhes do Fato
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Data do Fato (Quando?)"
            name="dataFato"
            type="date"
            value={formData.dataFato}
            onChange={handleInputChange}
            helperText="Data em que ocorreu o fato"
          />

          <Select
            label="Horario do Fato"
            name="horarioFato"
            options={horarioOptions}
            value={formData.horarioFato}
            onChange={handleInputChange}
            placeholder="Selecione o periodo"
            helperText="Periodo aproximado em que ocorreu"
          />
        </div>

        <Textarea
          label="Local (Onde?)"
          name="local"
          value={formData.local}
          onChange={handleInputChange}
          placeholder="Ex: UPA do Gama, Setor Central, proximo ao terminal rodoviario"
          helperText="Informe o local com referencias onde ocorreu o fato"
          rows={2}
        />

        <Textarea
          label="Pessoas Envolvidas"
          name="pessoasEnvolvidas"
          value={formData.pessoasEnvolvidas}
          onChange={handleInputChange}
          placeholder="Ex: Servidor Joao da Silva (matricula 12345), Recepcionista de plantao"
          helperText="Nome das pessoas envolvidas, preferencialmente com numero da matricula"
          rows={2}
        />
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-lg font-semibold text-gray-900 mb-4">
          Identificacao
        </legend>

        <Checkbox
          label="Desejo fazer esta manifestacao de forma anonima"
          checked={formData.anonimo}
          onChange={handleCheckboxChange}
          helperText="Voce nao precisara informar seus dados pessoais, mas nao poderemos enviar respostas diretamente para voce."
        />

        {!formData.anonimo && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <Input
              label="Nome Completo"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleInputChange}
              error={errors.nome}
              required
              autoComplete="name"
            />

            <Input
              label="E-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
              autoComplete="email"
              helperText="Usaremos este e-mail para enviar atualizacoes sobre sua manifestacao."
            />

            <Input
              label="Telefone (opcional)"
              name="telefone"
              type="tel"
              value={formData.telefone}
              onChange={handleInputChange}
              autoComplete="tel"
              placeholder="(61) 99999-9999"
            />
          </div>
        )}
      </fieldset>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/')}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Enviar Manifestacao
        </Button>
      </div>
    </form>
  );
}
