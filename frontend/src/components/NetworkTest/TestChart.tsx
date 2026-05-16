import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

interface DataPoint {
  time: string;
  ping: number;
}

interface TestChartProps {
  data: DataPoint[];
  medianPing?: number;
}

const TestChart: React.FC<TestChartProps> = ({ data, medianPing }) => {
  if (data.length === 0) return null;

  return (
    <div className="gcard p-5">
      <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">График пинга</h4>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a50" />
          <XAxis dataKey="time" stroke="#475569" tick={{ fill: '#475569', fontSize: 11 }} />
          <YAxis stroke="#475569" tick={{ fill: '#475569', fontSize: 11 }} unit=" ms" />
          <Tooltip
            contentStyle={{ background: '#0f0f2a', border: '1px solid #2a2a50', borderRadius: 8 }}
            labelStyle={{ color: '#94a3b8' }}
            itemStyle={{ color: '#818cf8' }}
          />
          <Line type="monotone" dataKey="ping" stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: '#6366f1' }} />
          {medianPing && (
            <ReferenceLine
              y={medianPing}
              stroke="#22c55e"
              strokeDasharray="4 4"
              label={{ value: `Медиана ${medianPing.toFixed(1)} ms`, fill: '#22c55e', fontSize: 11 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TestChart;
