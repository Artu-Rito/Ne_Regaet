export interface NetworkTest {
  id: string;
  user_id: string;
  ping: number;
  jitter: number;
  packet_loss: number;
  game_server: string;
  tested_at: string;
  created_at: string;
}

export interface NetworkStats {
  median_ping: number;
  avg_ping: number;
  min_ping: number;
  max_ping: number;
  avg_jitter: number;
  avg_packet_loss: number;
  total_tests: number;
}

export interface GameServer {
  id: string;
  name: string;
  ip: string;
  port: number;
  game: string;
  region: string;
}

export interface ServerStatus extends GameServer {
  ping_ms: number;
  online: boolean;
}

export interface LeaderboardEntry {
  user_id: string;
  nickname: string;
  avg_ping: number;
  total_tests: number;
}
