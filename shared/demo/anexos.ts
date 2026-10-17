// Cenário local e determinístico da Anexos Design. Não observa sessões nem faz rede.
import type { Activity, AgentInfo, OfficeSnapshot, RoomInfo } from '../types';
import { hash32 } from '../hash';
import { DemoSimulator, type DemoTickResult } from './simulator';

const ago = (now: number, minutes: number) => now - minutes * 60_000;
const activity = (id: string, at: number, kind: Activity['kind'], icon: string, text: string, error?: boolean): Activity => ({ id, at, kind, icon, text, ...(error ? { error } : {}) });

/** Adaptador de demonstração: dados fixos, sem conexão com Workers, contas ou Habblaud World. */
export class AnexosSimulator extends DemoSimulator {
  constructor(private readonly started = Date.now()) {
    super({ idPrefix: 'demo:anexos:', sessions: 0, seed: 42 }, started);
  }

  override tick(_now: number): DemoTickResult { return { changed: false, feed: [], notices: [] }; }

  override snapshot(now = Date.now()): OfficeSnapshot {
    const shopee = 'demo:anexos:shopee';
    const triagem = 'demo:anexos:triagem';
    const room: RoomInfo = { id: 'demo:anexos:/simulacao-anexos', name: 'Simulação Anexos', path: '/simulacao-anexos', slot: 0, seed: hash32('anexos'), createdAt: this.started };
    const syncRecent = [
      activity('anexos-shopee-1', ago(now, 11), 'prompt', '📨', 'Execução simulada iniciada'),
      activity('anexos-shopee-2', ago(now, 8), 'read', '📦', 'Lendo pedidos simulados da Shopee'),
      activity('anexos-shopee-3', ago(now, 3), 'wait', '⏳', 'Aguardando janela de sincronização'),
    ];
    const triageRecent = [
      activity('anexos-triagem-1', ago(now, 12), 'prompt', '📨', 'Execução simulada iniciada'),
      activity('anexos-triagem-2', ago(now, 9), 'plan', '🧭', 'Classificando conversas; sem encaminhamento'),
      activity('anexos-triagem-3', ago(now, 5), 'done', '✅', 'Lote concluído: 18 conversas registradas'),
      activity('anexos-triagem-4', ago(now, 1), 'error', '⚠️', 'Falhou: payload de exemplo inválido', true),
    ];
    const base = (id: string, name: string, status: AgentInfo['status'], title: string, recent: Activity[], seed: number): AgentInfo => ({
      id, kind: 'main', provider: 'codex', roomId: room.id, name, look: 'f', role: 'Rotina externa simulada', title,
      sessionId: id, account: 'demo:anexos', status, activity: recent.at(-1), recent,
      tasks: [], model: 'simulado', startedAt: ago(now, 15), lastEventAt: recent.at(-1)!.at, statusSince: recent.at(-1)!.at,
      stats: { toolCalls: recent.length, tokensIn: 0, tokensOut: 0, subagents: 0 }, seed,
    });
    const waiting = base(shopee, 'Sincronização Shopee', 'waiting', 'Aguardando janela de sincronização', syncRecent, hash32(shopee));
    waiting.waitingFor = 'nova execução simulada';
    const failed = base(triagem, 'Triagem de conversas', 'done', 'Falhou: payload de exemplo inválido', triageRecent, hash32(triagem));
    return { rev: 1, serverTime: now, rooms: [room], agents: [waiting, failed], accounts: [{ id: 'demo:anexos', provider: 'codex', short: 'AD', name: 'Simulação Anexos', color: '#c4773d', configDir: '(somente dados simulados)', sessions: 2, usageStatus: 'disabled' }], meta: { demo: true, sources: [], startedAt: this.started, version: 'anexos-simulation' } };
  }
}
