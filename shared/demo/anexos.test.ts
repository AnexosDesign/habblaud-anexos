import { describe, expect, it } from 'vitest';
import { AnexosSimulator } from './anexos';

describe('AnexosSimulator', () => it('mantém duas rotinas e seus eventos simulados locais', () => {
  const snap = new AnexosSimulator(1_000_000).snapshot(1_000_000);
  expect(snap.rooms[0].name).toBe('Simulação Anexos');
  expect(snap.agents.map((a) => a.name)).toEqual(['Sincronização Shopee', 'Triagem de conversas']);
  expect(snap.agents.flatMap((a) => a.recent.map((x) => x.kind))).toEqual(expect.arrayContaining(['wait', 'done', 'error']));
}));
