import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateProtocolo } from './protocolo.js';

describe('generateProtocolo', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve retornar string no formato YYYY-XXXXXX', () => {
    const protocolo = generateProtocolo();
    expect(protocolo).toMatch(/^\d{4}-\d{6}$/);
  });

  it('deve usar o ano corrente', () => {
    const anoAtual = new Date().getFullYear();
    const protocolo = generateProtocolo();
    expect(protocolo.startsWith(`${anoAtual}-`)).toBe(true);
  });

  it('deve gerar numeros com 6 digitos (com zero a esquerda)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.000001);
    const protocolo = generateProtocolo();
    const numero = protocolo.split('-')[1];
    expect(numero).toHaveLength(6);
  });

  it('deve gerar valor 000000 quando random retorna 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const protocolo = generateProtocolo();
    expect(protocolo.endsWith('-000000')).toBe(true);
  });

  it('deve gerar valor 999999 quando random retorna ~1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999999);
    const protocolo = generateProtocolo();
    expect(protocolo.endsWith('-999999')).toBe(true);
  });

  it('deve gerar protocolos diferentes em chamadas consecutivas', () => {
    const protocolos = new Set<string>();
    for (let i = 0; i < 100; i++) {
      protocolos.add(generateProtocolo());
    }
    // Com 100 gerações aleatórias de 6 dígitos, colisões são extremamente improváveis
    expect(protocolos.size).toBeGreaterThan(90);
  });
});
