import React, { useMemo } from 'react';

interface BarVisualizerProps {
  label: string;
  value: number | null;
  unit: string;
  maxValue?: number;
  warnAt?: number;
  dangerAt?: number;
  animate?: boolean;
}

const BAR_COUNT = 22;

function barColor(height: number, warn: number, danger: number): string {
  if (height >= danger) return '#ef4444';
  if (height >= warn) return '#eab308';
  return '#22c55e';
}

const BarVisualizer: React.FC<BarVisualizerProps> = ({
  label,
  value,
  unit,
  maxValue = 300,
  warnAt = 60,
  dangerAt = 100,
  animate = false,
}) => {
  const bars = useMemo(() => {
    const normalised = value !== null ? Math.min(value / maxValue, 1) : 0;

    return Array.from({ length: BAR_COUNT }, (_, i) => {
      const center = BAR_COUNT / 2;
      const dist = Math.abs(i - center) / center;
      // Bell curve shape, peak at normalised * 100%
      const gaussBase = Math.exp(-Math.pow(dist * 2.5, 2));
      const height = Math.round(gaussBase * normalised * 100);
      return Math.max(height, value !== null ? 3 : 8);
    });
  }, [value, maxValue]);

  const displayValue =
    value === null ? '------' :
    value < 0     ? 'N/A   ' :
    String(Math.round(value)).padStart(6, ' ');

  const valueColor =
    value === null || value < 0 ? 'text-slate-500' :
    value >= dangerAt  ? 'text-red-400' :
    value >= warnAt    ? 'text-yellow-400' :
    'text-green-400';

  return (
    <div className="flex flex-col items-center gap-3 p-4 gcard w-full">
      <span className="text-xs text-slate-400 uppercase tracking-widest">{label}</span>

      {/* Bar chart */}
      <div className="flex items-end gap-[2px] h-28 w-full justify-center">
        {bars.map((h, i) => {
          const color = barColor(
            value !== null && value >= 0 ? (h / 100) * maxValue : 0,
            warnAt,
            dangerAt,
          );
          return (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-all ${animate ? 'duration-150' : 'duration-500'}`}
              style={{ height: `${h}%`, backgroundColor: color, maxWidth: 14 }}
            />
          );
        })}
      </div>

      {/* Digital display */}
      <div className={`digital text-3xl font-bold ${valueColor} tracking-wider`}>
        {displayValue}
        <span className="text-base text-slate-500 ml-1">{unit}</span>
      </div>
    </div>
  );
};

export default BarVisualizer;
