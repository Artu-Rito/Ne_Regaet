import { create } from 'zustand';
import { NetworkTest, NetworkStats } from '../types/network';
import { networkService } from '../services/networkService';

interface TestState {
  isTesting: boolean;
  tests: NetworkTest[];
  stats: NetworkStats | null;
  currentTest: NetworkTest | null;
  startTest: (serverId?: string) => Promise<void>;
  getTests: (page?: number, limit?: number) => Promise<void>;
  getStats: (period?: string) => Promise<void>;
  resetCurrentTest: () => void;
}

export const useTestStore = create<TestState>((set, get) => ({
  isTesting: false,
  tests: [],
  stats: null,
  currentTest: null,

  startTest: async (serverId?: string) => {
    set({ isTesting: true });

    try {
      // Real HTTP RTT measurement
      const { ping, jitter, packetLoss } = await networkService.measureRTT(7);

      // Resolve server name from current servers list if we have the ID
      let gameServerName = 'Unknown';
      if (serverId) {
        try {
          const { servers } = await networkService.getServers();
          const found = servers.find((s) => s.id === serverId);
          if (found) gameServerName = found.name;
        } catch { /* non-critical */ }
      }

      const response = await networkService.submitTest({
        ping,
        jitter,
        packet_loss: packetLoss,
        game_server: gameServerName,
      });

      set({
        isTesting: false,
        currentTest: response.test,
        stats: response.stats,
      });
      set((state) => ({
        tests: [response.test, ...state.tests.slice(0, 19)],
      }));

      // Refresh community stats
      get().getStats('7d');
    } catch (error) {
      set({ isTesting: false });
      console.error('Test failed:', error);
    }
  },

  getTests: async (page = 1, limit = 20) => {
    try {
      const response = await networkService.getTests(page, limit);
      set({ tests: response.tests });
    } catch (error) {
      console.error('Failed to get tests:', error);
    }
  },

  getStats: async (period = '7d') => {
    try {
      const response = await networkService.getStats(period);
      set({ stats: response.stats });
    } catch (error) {
      console.error('Failed to get stats:', error);
    }
  },

  resetCurrentTest: () => set({ currentTest: null }),
}));
