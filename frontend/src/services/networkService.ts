import api from './api';
import { NetworkTest, NetworkStats, GameServer, ServerStatus, LeaderboardEntry } from '../types/network';

export interface TestInput {
  ping: number;
  jitter: number;
  packet_loss: number;
  game_server: string;
}

/**
 * Measures real HTTP RTT to our backend.
 * Sends `samples` requests, discards outliers, returns median ping and jitter.
 */
async function measureRTT(samples = 7): Promise<{ ping: number; jitter: number; packetLoss: number }> {
  const times: number[] = [];
  let failed = 0;

  await Promise.allSettled(
    Array.from({ length: samples }, async () => {
      const t0 = performance.now();
      try {
        await api.get('/network/ping');
        times.push(performance.now() - t0);
      } catch {
        failed++;
      }
    }),
  );

  if (times.length === 0) return { ping: -1, jitter: 0, packetLoss: 100 };

  times.sort((a, b) => a - b);
  // Drop top outlier
  const trimmed = times.length > 2 ? times.slice(0, -1) : times;
  const median = trimmed[Math.floor(trimmed.length / 2)];
  const jitter = trimmed[trimmed.length - 1] - trimmed[0];
  const packetLoss = (failed / samples) * 100;

  return { ping: Math.round(median), jitter: Math.round(jitter), packetLoss };
}

export const networkService = {
  measureRTT,

  submitTest: async (data: TestInput): Promise<{ test: NetworkTest; stats: NetworkStats }> => {
    const response = await api.post('/network/test', data);
    return response.data;
  },

  getTests: async (page = 1, limit = 20, from?: string, to?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const response = await api.get(`/network/tests?${params}`);
    return response.data;
  },

  getStats: async (period = '7d'): Promise<{ stats: NetworkStats }> => {
    const response = await api.get(`/network/stats?period=${period}`);
    return response.data;
  },

  getLeaderboard: async (gameServer?: string, limit = 100): Promise<{ players: LeaderboardEntry[] }> => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (gameServer) params.append('gameServer', gameServer);
    const response = await api.get(`/network/leaderboard?${params}`);
    return response.data;
  },

  getServers: async (): Promise<{ servers: GameServer[] }> => {
    const response = await api.get('/network/servers');
    return response.data;
  },

  getServersStatus: async (): Promise<{ servers: ServerStatus[] }> => {
    const response = await api.get('/network/servers/status');
    return response.data;
  },

  testServer: async (serverId: string): Promise<{ server_ping: number; recommendation: string }> => {
    const response = await api.post('/network/test-server', { serverId });
    return response.data;
  },
};
